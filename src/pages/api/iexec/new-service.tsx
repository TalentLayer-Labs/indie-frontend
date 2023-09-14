import mongoose from 'mongoose';
import { EmailType, IService, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { getUserWeb3mailPreferencesForNewServices } from '../../../queries/users';
import { calculateCronData } from '../../../modules/Web3Mail/utils/cron-utils';
import {
  checkNewServiceExistenceInDb,
  persistCronProbe,
  persistEmail,
} from '../../../modules/Web3Mail/utils/database-utils';
import { Contact, IExecWeb3mail, getWeb3Provider as getMailProvider } from '@iexec/web3mail';
import { getNewServicesForPlatform } from '../../../queries/services';

/** TODO A faire dans cet ordre
 get keywords - save in map => array of keywords
 on loop sur les contacts, premier check sur metadata
 2eme check sur chaque service dans la db (id = serviceid-userid-emailtype)
 3ème check sur les keywords
 Si tous les checks passent, on envoie l'email, on persiste en db
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.NEXT_MONGO_URI;
  const RETRY_FACTOR = 5;
  let successCount = 0,
    errorCount = 0;

  // Check whether the API key is valid
  const key = req.query.key;
  if (key !== process.env.NEXT_PRIVATE_CRON_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Check whether the Iexec key is valid
  const iexecPrivateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!iexecPrivateKey) {
    return res.status(500).json('Private key is not set');
  }

  // Check whether the database is set
  if (!mongoUri) {
    return res.status(500).json('MongoDb URI is not set');
  }
  await mongoose.connect(mongoUri as string);

  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    return res.status(500).json('Platform Id is not set');
  }

  // Check whether the user provided a timestamp or if it will come from the cron config
  const { sinceTimestamp, cronDuration } = calculateCronData(
    req,
    RETRY_FACTOR,
    EmailType.NewService,
  );
  console.log('timestamp', sinceTimestamp);

  //TODO: Si erreur de graph ou de mongo: kill le script => err 500
  try {
    const mailWeb3Provider = getMailProvider(iexecPrivateKey);
    const web3mail = new IExecWeb3mail(mailWeb3Provider);
    const contactList: Contact[] = await web3mail.fetchMyContacts();
    console.log('contactList', contactList);

    // Check if new services are available & get their keywords
    const response = await getNewServicesForPlatform(platformId, sinceTimestamp);
    console.log('All Services', response.data.data.services);
    const services = response.data.data.services;

    if (services.length === 0) {
      return res.status(200).json(`No new services available`);
    }

    for (const contact of contactList) {
      console.log(
        '*************************************contact*************************************',
        contact.address,
      );
      // Check whether the user opted for the called feature
      //TODO query not tested
      const userData = await getUserWeb3mailPreferencesForNewServices(
        platformId,
        contact.address,
        Web3mailPreferences.activeOnNewService,
      );
      // TODO uncomment when feature is ready
      // if (!userData.description.web3mailPreferences.activeOnNewService) {
      //   console.error(`User has not opted in for the ${EmailType.PlatformMarketing} feature`);
      //   continue;
      // }
      for (const service of services as IService[]) {
        // Check if the service is already in the DB for this user
        const serviceIsInDb = await checkNewServiceExistenceInDb(
          userData.id,
          service,
          EmailType.NewService,
        );
        if (!serviceIsInDb) {
          try {
            // const userSkills = ['python', 'python experimental economics toolkit peet'];
            const userSkills = userData.skills_raw?.split(',');
            const serviceSkills = service.description?.keywords_raw?.split(',');
            // Check if the service keywords match the user keywords
            const matchingSkills = userSkills?.filter((skill: string) =>
              serviceSkills?.includes(skill),
            );
            console.log('userSkills', userSkills);
            console.log('serviceSkills', serviceSkills);
            console.log('matchingSkills', matchingSkills);
            if (matchingSkills?.length > 0) {
              await sendMailToAddresses(
                `A new service matching your skills is available on TalentLayer !`,
                `Good news, the following service: "${
                  service.description?.title
                }" was recently posted by ${service.buyer.handle} and you are a good match for it.
                  Here is what is proposed: ${service.description?.about}.
                  You can go check it out here: PLATFORM_URL/${service.id}.
                  The skills you have which are required by this service are: ${matchingSkills.join(
                    ', ',
                  )}.
                  Be the first one to send a proposal !`,
                [contact.address],
                true,
              );
              await persistEmail(`${userData.id}-${service.id}`, EmailType.NewService);
              successCount++;
              console.log('Email sent');
            }
          } catch (e: any) {
            errorCount++;
            console.error(e.message);
          }
        }
      }
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json(`Error while sending email - ${e.message}`);
  } finally {
    if (!req.query.sinceTimestamp) {
      // Update cron probe in db
      persistCronProbe(EmailType.NewService, successCount, errorCount, cronDuration);
    }
  }
  return res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

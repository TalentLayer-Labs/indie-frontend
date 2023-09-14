import { EmailType, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { getUserWeb3mailPreferences } from '../../../queries/users';
import { IExecWeb3mail, getWeb3Provider as getMailProvider, Contact } from '@iexec/web3mail';

//TODO: No persisting in Db for non sent emails, as no campaign id
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let successCount = 0,
    errorCount = 0;

  const { emailSubject, emailContent } = req.body;
  if (!emailSubject || !emailContent) return res.status(500).json(`Missing argument`);

  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    return res.status(500).json('Private key is not set');
  }

  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    return res.status(500).json('Platform Id is not set');
  }

  try {
    const mailWeb3Provider = getMailProvider(privateKey);
    const web3mail = new IExecWeb3mail(mailWeb3Provider);
    const contactList: Contact[] = await web3mail.fetchMyContacts();

    if (contactList) {
      for (const contact of contactList) {
        console.log(contact.address);
        try {
          // Check whether the user opted for the called feature
          //TODO query not tested
          const userWeb3mailPreferences = await getUserWeb3mailPreferences(
            platformId,
            contact.address,
            Web3mailPreferences.activeOnPlatformMarketing,
          );
          if (!userWeb3mailPreferences) {
            throw new Error(`User has not opted in for the ${EmailType.PlatformMarketing} feature`);
          }
          await sendMailToAddresses(`${emailSubject}`, `${emailContent}`, [contact.address], true);
          successCount++;
          console.log('Email sent');
        } catch (e: any) {
          errorCount++;
          console.error(e.message);
        }
      }
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).json(`Error while sending email - ${e.message}`);
  }
  return res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

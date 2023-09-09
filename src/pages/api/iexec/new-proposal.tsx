import mongoose from 'mongoose';
import { getProposalsFromPlatformServices } from '../../../queries/proposals';
import { EmailType, IProposal, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { CronProbe } from '../../../modules/Web3Mail/schemas/timestamp-model';
import * as vercel from '../../../../vercel.json';
import { parseExpression } from 'cron-parser';
import { Web3Mail } from '../../../modules/Web3Mail/schemas/web3mail-model';
import { getUserWeb3mailPreferences } from '../../../queries/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.NEXT_MONGO_URI;
  const TIMESTAMP_NOW_SECONDS = Math.floor(new Date().getTime() / 1000);
  const RETRY_FACTOR = 5;

  // Check whether the key is valid
  const key = req.query.key;
  if (key !== process.env.NEXT_PRIVATE_CRON_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!mongoUri) {
    throw new Error('MongoDb URI is not set');
  }
  await mongoose.connect(mongoUri as string);

  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    throw new Error('Platform Id is not set');
  }

  // Check whether the user provided a timestamp or if it will come from the cron config
  let sinceTimestamp: string | undefined = '';
  let cronDuration = 0;
  if (req.query.sinceTimestamp) {
    sinceTimestamp = req.query.sinceTimestamp as string;
  } else {
    const cronSchedule = vercel?.crons?.find(cron => cron.type == EmailType.NewProposal)?.schedule;
    if (!cronSchedule) {
      throw new Error('No Cron Schedule found');
    }
    /** @dev: The timestamp is set to the previous cron execution minus the duration
    of the cron schedule multiplied by a retry factor, so that non sent emails
    can be sent again */
    const cronExpression = parseExpression(cronSchedule);
    cronDuration =
      cronExpression.next().toDate().getTime() / 1000 -
      cronExpression.prev().toDate().getTime() / 1000;
    sinceTimestamp = (
      cronExpression.prev().toDate().getTime() / 1000 -
      cronDuration * RETRY_FACTOR
    ).toString();
  }
  console.log('timestamp', sinceTimestamp);
  try {
    //TODO Uncomment
    const response = await getProposalsFromPlatformServices(platformId, '0');
    // const response = await getProposalsFromPlatformServices(platformId, sinceTimestamp);
    console.log('All proposals', response.data.data.proposals);
    const nonSentProposals: IProposal[] = [];

    // Check if some proposals are not already in the DB
    if (response.data.data.proposals.length > 0) {
      for (const proposal of response.data.data.proposals as IProposal[]) {
        console.log('Proposal', proposal.service.buyer.address);
        try {
          const existingProposal = await Web3Mail.findOne({
            id: `${proposal.id}-${EmailType.NewProposal}`,
          });
          if (!existingProposal) {
            console.error('Proposal not in DB');
            nonSentProposals.push(proposal);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // If some proposals are not already in the DB, email the hirer & persist the proposal in the DB
    if (nonSentProposals) {
      let successCount = 0;
      let errorCount = 0;
      for (const proposal of nonSentProposals) {
        try {
          // Check whether the user opted for the called feature
          //TODO query not tested
          const userWeb3mailPreferences = await getUserWeb3mailPreferences(
            platformId,
            proposal.service.buyer.address,
            Web3mailPreferences.activeOnNewProposal,
          );
          if (!userWeb3mailPreferences) {
            //TODO @Romain: Throw error here caught l118 or is this fine ?
            errorCount++;
            console.warn(`User has not opted in for the ${EmailType.NewProposal} feature`);
            continue;
          }
          // @dev: This function needs to be throwable to avoid persisting the proposal in the DB if the email is not sent
          await sendMailToAddresses(
            `You got a new proposal ! - ${proposal.description?.title}`,
            `You just received a new proposal for the service ${proposal.service.id} you posted on TalentLayer !
              ${proposal.seller.handle} can complete your service for the following amount: ${proposal.rateAmount} : ${proposal.rateToken.symbol}.
              Here is what is proposed: ${proposal.description?.about}.
              This Proposal can be viewed at ${process.env.NEXT_PUBLIC_IPFS_BASE_URL}${proposal.id}`,
            [proposal.service.buyer.address],
            true,
          );
          const sentEmail = await Web3Mail.create({
            id: `${proposal.id}-${EmailType.NewProposal}`,
            type: EmailType.NewProposal,
            sentAt: `${TIMESTAMP_NOW_SECONDS}`,
          });
          sentEmail.save();
          successCount++;
          console.log('Email sent');
        } catch (e) {
          errorCount++;
          console.error(e);
        } finally {
          if (!req.query.sinceTimestamp) {
            // Update cron probe in db
            const cronProbe = await CronProbe.create({
              type: EmailType.NewProposal,
              lastRanAt: `${TIMESTAMP_NOW_SECONDS}`,
              successCount: successCount,
              errorCount: errorCount,
              duration: cronDuration,
            });
            cronProbe.save();
          }
        }
      }
    }
  } catch (e: any) {
    console.error(e);
    await mongoose.disconnect();
    res.status(500).json(`Error while sending email - ${e.message}`);
  }
  res.status(200).json('Tudo Bem');
  //TODO: "unhandledRejection: Error [MongoNotConnectedError]: Client must be connected before running operations"
  await mongoose.disconnect();
}

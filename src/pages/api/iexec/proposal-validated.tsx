import mongoose from 'mongoose';
import { getAcceptedProposal } from '../../../queries/proposals';
import { EmailType, IProposal, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { getUserWeb3mailPreferences } from '../../../queries/users';
import { calculateCronData } from '../../../modules/Web3Mail/utils/cron-utils';
import {
  checkProposalExistenceInDb,
  persistCronProbe,
  persistEmail,
} from '../../../modules/Web3Mail/utils/database-utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.NEXT_MONGO_URI;
  const RETRY_FACTOR = 5;
  let successCount = 0,
    errorCount = 0;

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
  const { sinceTimestamp, cronDuration } = calculateCronData(
    req,
    RETRY_FACTOR,
    EmailType.ProposalValidated,
  );
  console.log('timestamp', sinceTimestamp);
  try {
    const response = await getAcceptedProposal(platformId, sinceTimestamp);
    console.log('All proposals', response.data.data.proposals);
    const nonSentProposals: IProposal[] = [];

    // Check if some proposals are not already in the DB
    if (response.data.data.proposals.length > 0) {
      for (const proposal of response.data.data.proposals as IProposal[]) {
        console.log('Proposal', proposal.service.buyer.address);
        await checkProposalExistenceInDb(proposal, nonSentProposals, EmailType.ProposalValidated);
      }
    }

    // If some proposals are not already in the DB, email the hirer & persist the proposal in the DB
    if (nonSentProposals) {
      for (const proposal of nonSentProposals) {
        try {
          // Check whether the user opted for the called feature
          //TODO query not tested
          const userWeb3mailPreferences = await getUserWeb3mailPreferences(
            platformId,
            proposal.service.buyer.address,
            Web3mailPreferences.activeOnProposalValidated,
          );
          if (!userWeb3mailPreferences) {
            throw new Error(`User has not opted in for the ${EmailType.ProposalValidated} feature`);
          }
          // @dev: This function needs to be throwable to avoid persisting the proposal in the DB if the email is not sent
          await sendMailToAddresses(
            `Your proposal got accepted ! - ${proposal.description?.title}`,
            `The proposal you made for the service ${proposal.service.id} you posted on TalentLayer got accepted by ${proposal.service.buyer} !
              The following amount was agreed: ${proposal.rateAmount} : ${proposal.rateToken.symbol}. 
              For the following work to be provided: ${proposal.description?.about}.
              This Proposal can be viewed at ${process.env.NEXT_PUBLIC_IPFS_BASE_URL}${proposal.id}`,
            [proposal.seller.address],
            true,
          );
          await persistEmail(proposal.id, EmailType.ProposalValidated);
          successCount++;
          console.log('Email sent');
        } catch (e: any) {
          errorCount++;
          console.error(e.message);
        }
      }
    }
  } catch (e: any) {
    console.error(e.message);
    return res.status(500).json(`Error while sending email - ${e.message}`);
  } finally {
    if (!req.query.sinceTimestamp) {
      // Update cron probe in db
      persistCronProbe(EmailType.ProposalValidated, successCount, errorCount, cronDuration);
    }
  }
  return res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

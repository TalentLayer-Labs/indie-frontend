import mongoose from 'mongoose';
import { getProposalsFromPlatformServices } from '../../../queries/proposals';
import { EmailType, IProposal } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { NewProposalEmail } from '../../../modules/Web3Mail/schemas/new-proposal-model';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { Timestamp } from '../../../modules/Web3Mail/schemas/timestamp-model';
import * as vercel from '../../../../vercel.json';
import { parseExpression } from 'cron-parser';

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
    const duration =
      cronExpression.next().toDate().getTime() / 1000 -
      cronExpression.prev().toDate().getTime() / 1000;
    sinceTimestamp = (
      cronExpression.prev().toDate().getTime() / 1000 -
      duration * RETRY_FACTOR
    ).toString();
  }
  console.log('timestamp', sinceTimestamp);
  try {
    //Get latest timestamp from DB if exists
    let timestamp = await Timestamp.findOne({ type: EmailType.NewProposal });
    if (!timestamp) {
      timestamp = await Timestamp.create({
        type: EmailType.NewProposal,
        date: `${TIMESTAMP_NOW_SECONDS - 3600 * 24}`,
      });
      timestamp.save();
    }
    const timestampValue = timestamp.date;

    // Overrite timestamp with new value
    await Timestamp.updateOne(
      { type: EmailType.NewProposal },
      { date: `${TIMESTAMP_NOW_SECONDS}` },
    );
    //TODO Uncomment
    const response = await getProposalsFromPlatformServices(platformId, '0');
    // const response = await getProposalsFromPlatformServices(platformId, timestampValue);
    console.log('All proposals', response.data.data.proposals);
    const nonSentProposals: IProposal[] = [];

    // Check if some proposals are not already in the DB
    if (response.data.data.proposals.length > 0) {
      for (const proposal of response.data.data.proposals as IProposal[]) {
        console.log('Proposal', proposal.service.buyer.address);
        try {
          const existingProposal = await NewProposalEmail.findOne({
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
      for (const proposal of nonSentProposals) {
        //TODO Do we need to integrate a check on user's metadata to see if they opted to a certain feature ?
        try {
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
          const sentEmail = await NewProposalEmail.create({
            id: `${proposal.id}-${EmailType.NewProposal}`,
            date: `${TIMESTAMP_NOW_SECONDS}`,
          });
          sentEmail.save();
          console.log('Email sent');
        } catch (e) {
          console.error(e);
        }
      }
    }
  } catch (e) {
    console.error(e);
    await mongoose.disconnect();
    res.status(500).json('Error while sending email');
  }
  res.status(200).json('Tudo Bem');
  await mongoose.disconnect();
}

import mongoose from 'mongoose';
import { getAcceptedProposal } from '../../../queries/proposals';
import { EmailType, IProposal } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { Timestamp } from '../../../modules/Web3Mail/schemas/timestamp-model';
import { Web3Mail } from '../../../modules/Web3Mail/schemas/web3mail-model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.NEXT_MONGO_URI;
  const TIMESTAMP_NOW_SECONDS = Math.floor(new Date().getTime() / 1000);

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
    const response = await getAcceptedProposal(platformId, '0');
    // const response = await getProposalsFromPlatformServices(platformId, timestampValue);
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
      for (const proposal of nonSentProposals) {
        //TODO Do we need to integrate a check on user's metadata to see if they opted to a certain feature ?
        //TODO Who do we send the notification to, buyer, seller or both ?
        try {
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
          const sentEmail = await Web3Mail.create({
            id: `${proposal.id}-${EmailType.ProposalValidated}`,
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

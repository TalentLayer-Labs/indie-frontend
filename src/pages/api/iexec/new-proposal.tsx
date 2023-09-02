import mongoose from 'mongoose';
import { getProposalsFromPlatformServices } from '../../../queries/proposals';
import { EmailType, IProposal } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { Email } from '../../../scripts/iexec/cron/proposal-model';
import { sendMailToAddresses } from '../../../scripts/sendMailToAddresses';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.NEXT_MONGO_URI;

  if (!mongoUri) {
    throw new Error('MongoDb URI is not set');
  }
  await mongoose.connect(mongoUri as string);

  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    throw new Error('Private key is not set');
  }
  try {
    const response = await getProposalsFromPlatformServices(platformId);
    console.log('All proposals', response.data.data.proposals);
    const nonSentProposals: IProposal[] = [];

    // Check if some proposals are not already in the DB
    if (response.data.data.proposals.length > 0) {
      for (const proposal of response.data.data.proposals as IProposal[]) {
        console.log('Proposal', proposal.service.buyer.address);
        try {
          const existingProposal = await Email.findOne({
            id: `${proposal.id}-${EmailType.NewProposal}`,
          });
          if (!existingProposal) {
            console.log('Proposal not in DB');
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
        try {
          // @dev: This function needs to be throwable to avoid persisting the proposal in the DB if the email is not sent
          await sendMailToAddresses(
            `You got a new proposal ! - ${proposal.description?.title}`,
            `You just received a new proposal for the service ${proposal.service.id} you posted on TalentLayer !
              ${proposal.seller.handle} can complete your service for the following amount: ${proposal.rateAmount} : ${proposal.rateToken}. 
              Here is what is proposed: ${proposal.description?.about}.
              This Proposal can be viewed at ${process.env.NEXT_PUBLIC_IPFS_BASE_URL}${proposal.id}`,
            [proposal.service.buyer.address],
            true,
          );
          const sentEmail = await Email.create({
            id: `${proposal.id}-${EmailType.NewProposal}`,
            date: `${new Date().getTime()}`,
          });
          sentEmail.save();
          console.log('Email sent');
        } catch (e) {
          console.error(e);
        }
      }
    }
  } catch (e) {
    console.log(e);
    await mongoose.disconnect();
    //TODO : handle error - List of emails which didnt go through ?
    res.status(500).json('Error while sending email');
  }
  res.status(200).json('Tudo Bem');
  await mongoose.disconnect();
}

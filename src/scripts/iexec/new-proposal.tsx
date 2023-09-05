import mongoose from 'mongoose';
import { Email } from '../../modules/Web3Mail/schemas/proposal-model';
import { getProposalsFromPlatformServices } from '../../queries/proposals';
import { EmailType, IProposal } from '../../types';
import { sendMailToAddresses } from './sendMailToAddresses';

const sendAcceptedProposalsEmail = async (timestamp?: string) => {
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
    const response = await getProposalsFromPlatformServices(platformId, timestamp);
    const nonSentProposalIds: IProposal[] = [];

    // Check if some proposals are not already in the DB
    if (response.data.data.proposals.length > 0) {
      for (const proposal of response.data.data.proposals as IProposal[]) {
        try {
          const existingProposal = await Email.findOne({
            id: `${proposal.id}-${EmailType.NewProposal}`,
          });
          if (!existingProposal) {
            nonSentProposalIds.push(proposal);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // If some proposals are not already in the DB, email the hirer & persist the proposal in the DB
    if (nonSentProposalIds) {
      for (const proposal of nonSentProposalIds) {
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
    console.error(e);
    await mongoose.disconnect();
  }
  await mongoose.disconnect();
};

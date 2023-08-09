import * as cron from 'node-cron';
import mongoose from 'mongoose';
import { Proposal } from './proposal-model';
import { getProposalsFromPlatformServices } from '../../../../queries/proposals';
import { IProposal } from '../../../../types';
import { sendMailToMyContacts } from '../sendMailToMyContacts';

const setCron = async () => {
  const mongoUri = process.env.NEXT_PUBLIC_MONGO_URI;

  if (!mongoUri) {
    throw new Error('MongoDb URI is not set');
  }
  await mongoose.connect(mongoUri as string);

  cron.schedule('* */1 * * * *', async () => {
    console.log('Running a task every 1 hour');
    const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

    if (!platformId) {
      throw new Error('Private key is not set');
    }
    try {
      const response = await getProposalsFromPlatformServices(platformId);
      const nonSentProposalIds: IProposal[] = [];
      // Check if some proposals are not already in the DB
      if (response.data.data.proposals.length > 0) {
        for (const proposal of response.data.data.proposals as IProposal[]) {
          const existingProposal = await Proposal.findOne({ id: proposal.id });
          if (!existingProposal) {
            nonSentProposalIds.push(proposal);
          }
        }
      }
      // If there are some proposals not already in the DB, send an email to the hirer & persist the proposal in the DB
      if (nonSentProposalIds) {
        for (const proposal of nonSentProposalIds) {
          const sent = await sendMailToMyContacts(
            'You got a new proposal !',
            `You just received a new proposal from the service ${proposal.service.id} you posted on TalentLayer !`,
            [proposal.service.buyer.address],
          );
          const sentProposal = await Proposal.create({ id: proposal.id });
          sentProposal.save();
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};

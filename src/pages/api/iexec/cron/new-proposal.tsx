import * as cron from 'node-cron';
import mongoose from 'mongoose';
import { Proposal } from './proposal-model';
import { getProposalsFromPlatformServices } from '../../../../queries/proposals';
import { IProposal } from '../../../../types';
import { sendMailToMyContacts } from '../../utils/sendMailToMyContacts';
import { userGaveAccessToPlatform } from '../../utils/iexec-utils';

const setCron = async () => {
  cron.schedule('0 0 */1 * * *', async () => {
    console.log('Running a task every 1 hour');
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
      const nonSentProposalIds: IProposal[] = [];

      // Check if some proposals are not already in the DB
      if (response.data.data.proposals.length > 0) {
        for (const proposal of response.data.data.proposals as IProposal[]) {
          try {
            const existingProposal = await Proposal.findOne({ id: proposal.id });
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
            // Check if user granted access to his email
            const userGaveAccess = await userGaveAccessToPlatform(proposal.service.buyer.address);
            if (!userGaveAccess) {
              console.warn('User did not grant access to his email');
              continue;
            }

            await sendMailToMyContacts(
              'You got a new proposal !',
              `You just received a new proposal from the service ${proposal.service.id} you posted on TalentLayer !`,
              [proposal.service.buyer.address],
            );
            const sentProposal = await Proposal.create({ id: proposal.id });
            sentProposal.save();
            console.log('Email sent');
          } catch (e) {
            console.error(e);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
};

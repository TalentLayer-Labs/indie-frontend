import * as cron from 'node-cron';
import { sendMailToMyContacts } from '../../../pages/api/utils/sendMailToMyContacts';
import mongoose from 'mongoose';
import { Proposal } from './proposal-model';
import { getProposalsFromPlatformServices } from '../../../../queries/proposals';

// TODO: Run dans le context
await mongoose.connect(process.env.MONGO_URI as string);

console.log('pipi');
const cronJob = cron.schedule('* * */1 * * *', async () => {
  console.log('Running a task every 1 hour');
  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    throw new Error('Private key is not set');
  }
  const response = await getProposalsFromPlatformServices(platformId);
  console.log('proposals', response);
  const proposalIds: string[] = [];
  const nonSentProposalIdsEmails: string[] = [];
  if (response.data.proposals.length > 0) {
    response.data.proposals.forEach((proposal: any) => {
      proposalIds.push(proposal.id);
    });
    for (const id of proposalIds) {
      const proposal = await Proposal.findById(id);
      if (!proposal) {
        nonSentProposalIdsEmails.push(id);
      }
    }
    if (nonSentProposalIdsEmails) {
      for (const id of nonSentProposalIdsEmails) {
        await sendMailToMyContacts('You got a new proposal !', 'Blablablabla');
      }
    }
  }
});

const cronJob2 = setInterval(async () => {
  console.log('Running a task every 1 hour');
  //   TODO: Query new proposals ==> Gonna need a centralized DB to store the proposals already consumed
  //Emple query: send email to hirer when someone posts a proposal on their services (regardless of the platform).
  const platformId = process.env.NEXT_PUBLIC_PLATFORM_ID;

  if (!platformId) {
    throw new Error('Private key is not set');
  }
  const proposals = await getProposalsFromPlatformServices(platformId);
  // TODO proposals ? Push in array.
  console.log('proposals', proposals);
  // const proposal = await Proposal.findById();
}, 10000);

const mockProposals = {
  data: {
    proposals: [
      {
        id: '10-12',
      },
      {
        id: '11-12',
      },
      {
        id: '1-2',
      },
      {
        id: '12-6',
      },
      {
        id: '1-3',
      },
      {
        id: '13-12',
      },
      {
        id: '14-13',
      },
      {
        id: '15-13',
      },
      {
        id: '16-8',
      },
      {
        id: '2-4',
      },
      {
        id: '26-10',
      },
      {
        id: '3-5',
      },
      {
        id: '3-7',
      },
      {
        id: '4-13',
      },
      {
        id: '5-7',
      },
      {
        id: '6-19',
      },
      {
        id: '9-7',
      },
    ],
  },
};

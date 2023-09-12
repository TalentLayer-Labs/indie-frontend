import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';
import { NextApiRequest } from 'next';
import * as vercel from '../../../../vercel.json';
import { EmailType, IProposal } from '../../../types';
import { parseExpression } from 'cron-parser';
import { Web3Mail } from '../schemas/web3mail-model';
import { CronProbe } from '../schemas/timestamp-model';

const TIMESTAMP_NOW_SECONDS = Math.floor(new Date().getTime() / 1000);

export const userGaveAccessToPlatform = async (
  userAddress: string,
  providedDataProtector?: IExecDataProtector,
): Promise<string | null> => {
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }

  let dataProtector: IExecDataProtector;
  if (!providedDataProtector) {
    const protectorWebProvider = getProtectorProvider(privateKey);
    dataProtector = new IExecDataProtector(protectorWebProvider);
  } else {
    dataProtector = providedDataProtector;
  }

  const protectedData = await dataProtector.fetchProtectedData({
    owner: userAddress,
    requiredSchema: {
      email: 'string',
    },
  });

  const protectedEmail = protectedData.find(item => item.name === 'TalentLayer email');

  if (!protectedEmail) {
    console.warn(`Web3MailProvider ----  - User ${userAddress} has no protected email`);
    return null;
  }

  const listGrantedAccess = await dataProtector.fetchGrantedAccess({
    protectedData: protectedEmail.address,
    authorizedApp: process.env.NEXT_PUBLIC_WEB3MAIL_APP_ADDRESS,
  });

  if (listGrantedAccess.length == 0) {
    console.warn(
      `Web3MailProvider ----  - User ${userAddress} has not granted access to his email yet`,
    );
    return null;
  }

  console.warn(`Web3MailProvider ----  - User ${userAddress} has granted access to his email`);

  return protectedEmail.address;
};

export const calculateCronData = (
  req: NextApiRequest,
  RETRY_FACTOR: number,
  emailType: EmailType,
) => {
  let sinceTimestamp: string | undefined = '';
  let cronDuration = 0;
  if (req.query.sinceTimestamp) {
    sinceTimestamp = req.query.sinceTimestamp as string;
  } else {
    const cronSchedule = vercel?.crons?.find(cron => cron.type == emailType)?.schedule;
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
  return { sinceTimestamp, cronDuration };
};

export const checkProposalExistenceInDb = async (
  proposal: IProposal,
  nonSentProposals: IProposal[],
  emailType: EmailType,
) => {
  console.log('Proposal', proposal.service.buyer.address);
  try {
    const existingProposal = await Web3Mail.findOne({
      id: `${proposal.id}-${emailType}`,
    });
    if (!existingProposal) {
      console.error('Proposal not in DB');
      nonSentProposals.push(proposal);
    }
  } catch (e) {
    console.error(e);
  }
};

export const persistEmail = async (id: string, emailType: EmailType) => {
  const sentEmail = await Web3Mail.create({
    id: `${id}-${emailType}`,
    type: emailType,
    date: `${TIMESTAMP_NOW_SECONDS}`,
  });
  sentEmail.save();
};
export const persistCronProbe = async (
  emailType: EmailType,
  successCount: number,
  errorCount: number,
  cronDuration: number,
) => {
  const cronProbe = await CronProbe.create({
    type: emailType,
    lastRanAt: `${TIMESTAMP_NOW_SECONDS}`,
    successCount: successCount,
    errorCount: errorCount,
    duration: cronDuration,
  });
  cronProbe.save();
};

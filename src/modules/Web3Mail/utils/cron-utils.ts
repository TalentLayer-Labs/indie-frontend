import { NextApiRequest } from 'next';
import { EmailType } from '../../../types';
import * as vercel from '../../../../vercel.json';
import { parseExpression } from 'cron-parser';

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

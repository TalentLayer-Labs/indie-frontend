import mongoose from 'mongoose';
import { EmailType, IReview, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { getUserWeb3mailPreferences } from '../../../queries/users';
import { calculateCronData } from '../../../modules/Web3Mail/utils/cron-utils';
import {
  checkReviewExistenceInDb,
  persistCronProbe,
  persistEmail,
} from '../../../modules/Web3Mail/utils/database-utils';
import { getNewReviews } from '../../../queries/reviews';

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
  const { sinceTimestamp, cronDuration } = calculateCronData(req, RETRY_FACTOR, EmailType.Review);
  try {
    const response = await getNewReviews(platformId, sinceTimestamp);
    const nonSentReviewEmails: IReview[] = [];

    // Check if some entities are not already in the DB
    if (response.data.data.reviews.length > 0) {
      for (const review of response.data.data.reviews as IReview[]) {
        await checkReviewExistenceInDb(review, nonSentReviewEmails, EmailType.Review);
      }
    }

    // If some entities are not already in the DB, email the hirer & persist the payment in the DB
    if (nonSentReviewEmails) {
      for (const review of nonSentReviewEmails) {
        try {
          let fromHandle = '',
            fromAddress = '';
          review.to.address === review.service.buyer.address
            ? ((fromHandle = review.service.seller.handle),
              (fromAddress = review.service.seller.address))
            : ((fromHandle = review.service.buyer.handle),
              (fromAddress = review.service.buyer.address));
          // Check whether the user opted for the called feature | Seller if fund release, Buyer if fund reimbursement
          //TODO query not tested
          const userWeb3mailPreferences = await getUserWeb3mailPreferences(
            platformId,
            fromAddress,
            Web3mailPreferences.activeOnReview,
          );
          if (!userWeb3mailPreferences) {
            throw new Error(
              `User ${fromAddress} has not opted in for the ${EmailType.Review} feature`,
            );
          }
          // @dev: This function needs to be throwable to avoid persisting the entity in the DB if the email is not sent
          await sendMailToAddresses(
            `A review was created for the service - ${review.service.description?.title}`,
            `${fromHandle} has left a review for the TalentLayer service ${review.service.description?.title}.
            The service was rated ${review.rating}/5 stars and the following comment was left: ${review.description?.content}.
            Congratulations on completing your service and improving your TalentLayer reputation !`,
            [fromAddress],
            true,
          );
          await persistEmail(review.id, EmailType.Review);
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
      persistCronProbe(EmailType.Review, successCount, errorCount, cronDuration);
    }
  }
  return res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

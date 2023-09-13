import mongoose from 'mongoose';
import { getNewPayment } from '../../../queries/payments';
import { EmailType, IPayment, PaymentTypeEnum, Web3mailPreferences } from '../../../types';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendMailToAddresses } from '../../../scripts/iexec/sendMailToAddresses';
import { getUserWeb3mailPreferences } from '../../../queries/users';
import { calculateCronData } from '../../../modules/Web3Mail/utils/cron-utils';
import {
  checkPaymentExistenceInDb,
  persistCronProbe,
  persistEmail,
} from '../../../modules/Web3Mail/utils/database-utils';

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
  const { sinceTimestamp, cronDuration } = calculateCronData(
    req,
    RETRY_FACTOR,
    EmailType.FundRelease,
  );
  try {
    const response = await getNewPayment(platformId, sinceTimestamp);
    const nonSentPaymentEmails: IPayment[] = [];

    // Check if some entities are not already in the DB
    if (response.data.data.payments.length > 0) {
      for (const payment of response.data.data.payments as IPayment[]) {
        await checkPaymentExistenceInDb(payment, nonSentPaymentEmails, EmailType.FundRelease);
      }
    }

    // If some payments are not already in the DB, email the hirer & persist the payment in the DB
    if (nonSentPaymentEmails) {
      for (const payment of nonSentPaymentEmails) {
        try {
          let handle = '',
            action = '',
            address = '';
          payment.paymentType === PaymentTypeEnum.Release
            ? ((handle = payment.service.seller.handle),
              (action = 'released'),
              (address = payment.service.seller.address))
            : ((handle = payment.service.buyer.handle),
              (action = 'reimbursed'),
              (address = payment.service.buyer.address));
          // Check whether the user opted for the called feature | Seller if fund release, Buyer if fund reimbursement
          //TODO query not tested
          const userWeb3mailPreferences = await getUserWeb3mailPreferences(
            platformId,
            address,
            Web3mailPreferences.activeOnFundRelease,
          );
          if (!userWeb3mailPreferences) {
            throw new Error(
              `User ${address} has not opted in for the ${EmailType.FundRelease} feature`,
            );
          }
          // @dev: This function needs to be throwable to avoid persisting the entity in the DB if the email is not sent
          await sendMailToAddresses(
            `Funds ${action} for the service - ${payment.service.description?.title}`,
            `${handle} has ${action} ${payment.amount} ${payment.rateToken.symbol} for the 
            service ${payment.service.description?.title} on TalentLayer !`,
            [address],
            true,
          );
          await persistEmail(payment.id, EmailType.FundRelease);
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
      persistCronProbe(EmailType.FundRelease, successCount, errorCount, cronDuration);
    }
  }
  return res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

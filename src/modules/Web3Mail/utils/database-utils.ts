import { EmailType, IPayment, IProposal, IReview } from '../../../types';
import { Web3Mail } from '../schemas/web3mail-model';
import { CronProbe } from '../schemas/timestamp-model';

const getTimestampNowSeconds = () => Math.floor(new Date().getTime() / 1000);

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

export const checkPaymentExistenceInDb = async (
  payment: IPayment,
  nonSentPayments: IPayment[],
  emailType: EmailType,
) => {
  try {
    const existingPayment = await Web3Mail.findOne({
      id: `${payment.id}-${emailType}`,
    });
    if (!existingPayment) {
      console.error('Payment not in DB');
      nonSentPayments.push(payment);
    }
  } catch (e) {
    console.error(e);
  }
};

export const checkReviewExistenceInDb = async (
  review: IReview,
  nonSentReviews: IReview[],
  emailType: EmailType,
) => {
  try {
    const existingReview = await Web3Mail.findOne({
      id: `${review.id}-${emailType}`,
    });
    if (!existingReview) {
      console.error('Review not in DB');
      nonSentReviews.push(review);
    }
  } catch (e) {
    console.error(e);
  }
};

export const persistEmail = async (id: string, emailType: EmailType) => {
  const sentEmail = await Web3Mail.create({
    id: `${id}-${emailType}`,
    type: emailType,
    date: `${getTimestampNowSeconds()}`,
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
    lastRanAt: `${getTimestampNowSeconds()}`,
    successCount: successCount,
    errorCount: errorCount,
    duration: cronDuration,
  });
  cronProbe.save();
};

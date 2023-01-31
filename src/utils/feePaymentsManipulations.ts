import { IFeePayments, IToken } from '../types';
import { config } from '../config';
import { getTokenAmount } from './conversion';

// For each token, get the fee payments
export const getFeePaymentsByToken = (
  supportedTokens: { [key: string]: IToken },
  feePayments: IFeePayments[],
): IFeePayments[][] => {
  const feePaymentsByToken: IFeePayments[][] = [];
  for (const [key, value] of Object.entries(config.tokens)) {
    const filteredFeePayments = feePayments.filter((feePayment: { token: { address: string } }) => {
      return value.address == feePayment.token.address;
    });
    if (filteredFeePayments.length > 0) {
      feePaymentsByToken.push(filteredFeePayments);
    }
  }
  return feePaymentsByToken;
};

// For a specific token, get the total fee payments of the defined day
export const getSameDayFeePayments = (
  feePayments: IFeePayments[],
  token: { address: string },
  dayNumber: number,
): IFeePayments[] => {
  return feePayments.filter((feePayment: { token: { address: any }; createdAt: string }) => {
    if (feePayment.token.address != token.address) return false;
    return dayNumber == new Date(parseInt(feePayment.createdAt) * 1000).getDate();
  });
};

// For each day of the month, get the total amount of fee paid
export const getTotalAmountThisDay = (
  feePayments: IFeePayments[],
  token: { address: string },
): { day: number; amount: string }[] => {
  const today = new Date();
  const dataFeePayments: { day: number; amount: string }[] = [];
  const numberOfDayInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

  // For each day of the month, get the total amount of fee paid
  for (let dayNumber = 1; dayNumber <= numberOfDayInMonth; dayNumber++) {
    const sameDayFeePayments = getSameDayFeePayments(feePayments, token, dayNumber);
    const totalAmountThisDay =
      sameDayFeePayments.length > 0
        ? sameDayFeePayments.reduce(
            (acc: number, feePayment: { amount: string }) => acc + parseInt(feePayment.amount),
            0,
          )
        : 0;
    dataFeePayments.push({
      day: dayNumber,
      amount: getTokenAmount(token.address, String(totalAmountThisDay)),
    });
  }
  return dataFeePayments;
};

/* eslint-disable no-console */
import axios from 'axios';
import { BigNumber } from 'ethers';

export const delegateCreateService = async (
  userId: string,
  userAddress: string,
  cid: string,
  token: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/create-service', {
      userId,
      userAddress,
      cid,
      token,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const delegateCreateServiceWithReferral = async (
  userId: string,
  userAddress: string,
  cid: string,
  token: string,
  referralAmount: BigNumber,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/create-service-referral', {
      userId,
      userAddress,
      cid,
      token,
      referralAmount,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateUpdateService = async (
  userId: string,
  userAddress: string,
  serviceId: string,
  referralAmount: BigNumber,
  token: string,
  cid: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/update-service', {
      userId,
      userAddress,
      serviceId,
      referralAmount,
      token,
      cid,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateUpdateProfileData = async (
  userId: string,
  userAddress: string,
  cid: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/update-profil-data', {
      userId,
      userAddress,
      cid,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateCreateOrUpdateProposal = async (
  userId: string,
  userAddress: string,
  serviceId: string,
  parsedRateAmountString: string,
  cid: string,
  convertExpirationDateString: string,
  existingProposal: boolean,
  referrerId: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/create-update-proposal', {
      userId,
      userAddress,
      serviceId,
      parsedRateAmountString,
      cid,
      convertExpirationDateString,
      existingProposal,
      referrerId,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateReleaseOrReimburse = async (
  userAddress: string,
  profileId: string,
  transactionId: number,
  amount: string,
  isBuyer: boolean,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/release-reimburse', {
      userAddress,
      profileId,
      transactionId,
      amount,
      isBuyer,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateMintReview = async (
  userId: string,
  userAddress: string,
  serviceId: string,
  uri: string,
  valuesRating: number,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/mint-review', {
      userId,
      userAddress,
      serviceId,
      uri,
      valuesRating,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const delegateMintID = async (
  handle: string,
  handlePrice: any,
  userAddress: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/mint-id', {
      handle,
      handlePrice,
      userAddress,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

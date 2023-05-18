/* eslint-disable no-console */
import { strict } from 'assert';
import axios from 'axios';

export const delegateCreateService = async (
  userId: string,
  userAddress: string,
  cid: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/create-service', {
      userId,
      userAddress,
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
  valuesRateToken: string,
  parsedRateAmountString: string,
  cid: string,
  convertExpirationDateString: string,
  existingProposalStatus?: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/create-update-proposal', {
      userId,
      userAddress,
      serviceId,
      valuesRateToken,
      parsedRateAmountString,
      cid,
      convertExpirationDateString,
      existingProposalStatus,
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

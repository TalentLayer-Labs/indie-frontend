/* eslint-disable no-console */
import { FetchProtectedDataParams, ProtectDataParams } from '@iexec/dataprotector';
import axios from 'axios';
import { Address } from 'wagmi';

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

export const delegateUpdateService = async (
  userId: string,
  userAddress: string,
  serviceId: string,
  cid: string,
): Promise<any> => {
  try {
    return await axios.post('/api/delegate/update-service', {
      userId,
      userAddress,
      serviceId,
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

export const web3Mail = async (
  emailSubject: string,
  emailContent: string,
  protectedData: Address,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/web3mail', { emailSubject, emailContent, protectedData });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchMailContact = async (): Promise<any> => {
  try {
    return await axios.post('/api/iexec/fetch-contact', {});
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const dataProtector = async (protectDataArgs: ProtectDataParams): Promise<any> => {
  try {
    return await axios.post('/api/iexec/data-protector', protectDataArgs);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchProtectedData = async (
  fetchProtectedDataArg: FetchProtectedDataParams,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/fetch-protected-data', fetchProtectedDataArg);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

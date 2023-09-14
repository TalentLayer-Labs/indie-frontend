/* eslint-disable no-console */
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

export const activateCron = async (): Promise<any> => {
  try {
    // return await axios.post('/api/iexec/platform-marketing?key=racoonKey', {
    //   emailSubject: 'Coucou',
    //   emailContent: 'Ca va ?',
    // });
    // return await axios.post('/api/iexec/review?key=racoonKey');
    return await axios.post('/api/iexec/new-service?key=racoonKey&sinceTimestamp=1688189019');
    // return await axios.post('/api/iexec/fund-release?key=racoonKey');
    // return await axios.post('/api/iexec/new-proposal?key=racoonKey');
    // return await axios.post('/api/iexec/new-proposal?key=racoonKey&sinceTimestamp=12345454');
    // return await axios.post('/api/iexec/review?key=racoonKey&sinceTimestamp=12345454');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const sendmailToAddresses = async (
  emailSubject: string,
  emailContent: string,
  addresses: string[],
  throwable?: boolean,
): Promise<any> => {
  try {
    return await axios.post('/api/iexec/send-web3mail-to-addresses?key=racoonKey', {
      emailSubject,
      emailContent,
      addresses,
      throwable,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

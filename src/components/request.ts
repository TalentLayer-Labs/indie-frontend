/* eslint-disable no-console */
import axios from 'axios';

export const delegateCreateService = async (
  userId: string,
  userAddress: string,
  cid: string,
): Promise<any> => {
  try {
    return await axios.post('/api/post-service', {
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
    return await axios.post('/api/post-update-profil', {
      userId,
      userAddress,
      cid,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

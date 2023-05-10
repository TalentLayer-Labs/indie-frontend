/* eslint-disable no-console */
import axios from 'axios';
import { IUser } from '../types';
import { string } from 'yup/lib/locale';

export const delegatePostService = async (
  userId: string,
  userAddress: string,
  platformId: string | undefined,
  cid: string,
  signature: string,
): Promise<any> => {
  try {
    return await axios.post('/api/post-service', {
      userId,
      userAddress,
      platformId,
      cid,
      signature,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

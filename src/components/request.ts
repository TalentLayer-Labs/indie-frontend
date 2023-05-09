/* eslint-disable no-console */
import axios from 'axios';
import { IUser } from '../types';

export const delegatePostService = async (
  user: IUser,
  platformId: string | undefined,
  cid: string,
  signature: string,
): Promise<any> => {
  try {
    return await axios.post('/api/post-service', {
      user,
      platformId,
      cid,
      signature,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

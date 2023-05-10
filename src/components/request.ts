/* eslint-disable no-console */
import axios from 'axios';
import { IUser } from '../types';
import { string } from 'yup/lib/locale';

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

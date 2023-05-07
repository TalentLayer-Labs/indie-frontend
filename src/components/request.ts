/* eslint-disable no-console */
import axios from 'axios';

export const getDelegate = async (
  userId: string,
  platformId: string | undefined,
  cid: string,
  signature: string,
): Promise<any> => {
  try {
    return await axios.post('/api/get-delegate', {
      userId,
      platformId,
      cid,
      signature,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/* eslint-disable no-console */
import axios from 'axios';

export const getDelegate = async (id: string): Promise<any> => {
  try {
    return await axios.get('/api/get-delegate', { params: { id } });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

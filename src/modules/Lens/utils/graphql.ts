/* eslint-disable no-console */
import axios from 'axios';

export const processLensRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_LENS_URL, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

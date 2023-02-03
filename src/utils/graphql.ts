/* eslint-disable no-console */
import axios from 'axios';
import { config } from '../config';

export const processRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(config.subgraphUrl, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const processLensRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_LENS_URL, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

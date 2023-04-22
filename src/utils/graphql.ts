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

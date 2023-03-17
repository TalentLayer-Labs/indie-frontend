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

export const processSismoRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_SISMO_GRAPH_API, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

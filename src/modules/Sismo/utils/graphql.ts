/* eslint-disable no-console */
import axios from 'axios';

export const processSismoRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_SISMO_GRAPH_API, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

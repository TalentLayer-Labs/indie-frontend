/* eslint-disable no-console */
import axios from 'axios';

export const processPohRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(import.meta.env.VITE_POH_SUBGRAPH_URL, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

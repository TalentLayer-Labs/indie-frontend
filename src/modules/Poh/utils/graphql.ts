/* eslint-disable no-console */
import axios from 'axios';

export const processPohRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(process.env.NEXT_PUBLIC_POH_SUBGRAPH_URL as string, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

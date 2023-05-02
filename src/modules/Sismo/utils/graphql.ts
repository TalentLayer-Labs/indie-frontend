/* eslint-disable no-console */
import axios from 'axios';

export const processSismoRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(process.env.NEXT_PUBLIC_SISMO_GRAPH_API as string, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

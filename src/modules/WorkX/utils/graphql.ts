import axios from 'axios';

export const processWorkXRequest = async (query: string): Promise<any> => {
  try {
    return await axios.post(process.env.NEXT_PUBLIC_WORKX_API_URL as string, { query });
  } catch (err) {
    console.error(err);
    return null;
  }
};

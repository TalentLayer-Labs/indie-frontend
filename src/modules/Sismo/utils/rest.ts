import axios from 'axios';

export const callUrl = async (url: string): Promise<any> => {
  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err);
    return null;
  }
};

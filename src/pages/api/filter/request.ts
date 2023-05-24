/* eslint-disable no-console */
import { strict } from 'assert';
import axios from 'axios';

export const getFilteredServicesByKeywords = async (
  serviceStatus?: string,
  buyerId?: string,
  sellerId?: string,
  numberPerPage?: number,
  offset?: number,
): Promise<any> => {
  try {
    return await axios.post('/api/middleware/filtered-services', {
      serviceStatus,
      buyerId,
      sellerId,
      numberPerPage,
      offset,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

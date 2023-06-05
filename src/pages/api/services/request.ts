import axios from 'axios';
import { ServiceStatusEnum } from '../../../types';

export const getFilteredServicesByKeywords = async (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  numberPerPage?: number,
  offset?: number,
  searchQuery?: string,
): Promise<any> => {
  try {
    return await axios.get('/api/services/filtered', {
      params: {
        serviceStatus,
        buyerId,
        sellerId,
        numberPerPage,
        offset,
        searchQuery,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

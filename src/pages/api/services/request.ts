import axios from 'axios';
import { ServiceStatusEnum } from '../../../types';

export const getFilteredServicesByKeywords = async (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  numberPerPage?: number,
  offset?: number,
): Promise<any> => {
  try {
    return await axios.get('/api/services/filtered', {
      params: {
        serviceStatus,
        buyerId,
        sellerId,
        numberPerPage,
        offset,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

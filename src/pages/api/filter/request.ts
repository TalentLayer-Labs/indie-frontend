/* eslint-disable no-console */
import { strict } from 'assert';
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
    return await axios.post('/api/filter/filtered-services', {
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
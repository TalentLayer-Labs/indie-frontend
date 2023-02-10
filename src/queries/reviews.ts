import { processRequest } from '../utils/graphql';
import { reviewsFields } from './fieldTypes';

export const getReviewsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      reviews(where: { service: "${serviceId}" }, orderBy: id, orderDirection: desc) {
        ${reviewsFields}
      }
    }
    `;
  return processRequest(query);
};

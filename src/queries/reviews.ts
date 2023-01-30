import { processRequest } from '../utils/graphql';

export const getReviewsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      reviews(where: { service: "${serviceId}" }, orderBy: id, orderDirection: desc) {
        id
        service {
          id
          status
        }
        to {
          id
          handle
        }
        description{
          id
        }
      }
    }
    `;
  return processRequest(query);
};

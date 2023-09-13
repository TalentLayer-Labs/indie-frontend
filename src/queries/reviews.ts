import { processRequest } from '../utils/graphql';

export const getReviewsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      reviews(where: { service: "${serviceId}" }, orderBy: id, orderDirection: desc) {
        id
        rating
        createdAt
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
          content
        }
      }
    }
    `;
  return processRequest(query);
};

export const getNewReviews = (id: string, timestamp?: string): Promise<any> => {
  const timestampCondition = timestamp ? `, createdAt_gt: "${timestamp}"` : '';
  const query = `
      {
        reviews(
          orderBy: createdAt
          where: {service_: {platform: "${id}"} ${timestampCondition}}
        ) {
          id
          rating
          description {
            content
          }
          service {
            buyer {
              address
              handle
            }
            description {
              title
            }
            seller {
              address
              handle
            }
          }
          to {
            address
            handle
          }
        }
      }
    `;
  return processRequest(query);
};

import { processRequest } from '../utils/graphql';

export const getAllProposalsbyServiceId = (id: string): Promise<any> => {
  const query = `
    {
      proposals(where: {service_: {id: "${id}"}}) {
        service {
          id,
          uri
          buyer {
            id
          }
        }
        uri
        id
        status
        rateToken
        rateAmount
        createdAt
        updatedAt
        seller {
          id
          handle
          address
          uri
          withPoh
          rating
          numReviews
        }
      }
    }
    `;
  return processRequest(query);
};

export const getAllProposalsByUser = (id: string): Promise<any> => {
  const query = `
      {
        proposals(where: {seller: "${id}", status: "Pending"}) {
          id
          rateAmount
          rateToken
          status
          uri
          createdAt
          seller {
            id
            handle
          }
          service {
            id
            uri
            createdAt
            buyer {
              id
              handle
            }
          }
        }
      }
    `;
  return processRequest(query);
};

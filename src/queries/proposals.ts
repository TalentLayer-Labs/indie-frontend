import { processRequest } from '../utils/graphql';

export const getAllProposalsByServiceId = (id: string): Promise<any> => {
  const query = `
    {
      proposals(where: {service_: {id: "${id}"}}) {
        service {
          id,
          cid
          buyer {
            id
          }
          platform {
            id
          }
        }
        cid
        id
        status
        rateToken {
          address
          decimals
          name
          symbol
        }
        rateAmount
        createdAt
        updatedAt
        seller {
          id
          handle
          address
          cid
          rating
          userStats {
            numReceivedReviews
          }
        }
        description {
          id
          about
          expectedHours
          startDate
          video_url
        }
        expirationDate
        platform {
          id
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
          rateToken {
            address
            decimals
            name
            symbol
          }
          status
          cid
          createdAt
          seller {
            id
            handle
          }
          service {
            id
            cid
            createdAt
            buyer {
              id
              handle
            }
          }
          description {
            id
            about
            expectedHours
            startDate
            video_url
          }
          expirationDate
        }
      }
    `;
  return processRequest(query);
};

export const getProposalById = (id: string): Promise<any> => {
  const query = `
      {
        proposals(where: {id: "${id}"}) {
          rateToken {
            address
          }
          rateAmount
          description {
            about
            video_url
          }
          status
          expirationDate
        }
      }
    `;
  return processRequest(query);
};

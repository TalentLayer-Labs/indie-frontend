import { processRequest } from '../utils/graphql';

export const getAllProposalsByServiceId = (id: string): Promise<any> => {
  const query = `
    {
      proposals(where: {service_: {id: "${id}"}}) {
        service {
          id,
          cid,
          referralAmount
          buyer {
            id
          }
          platform {
            id
          }
          rateToken {
            address
            decimals
            name
            symbol
          }
        }
        cid
        id
        status
        rateAmount
        createdAt
        updatedAt
        seller {
          id
          handle
          address
          cid
          rating
          userStat {
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
            rateToken {
              address
              decimals
              name
              symbol
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
          service {
            rateToken {
                address
            }
          }
          rateAmount
          description {
            about
            video_url
          }
          referrer {
            id
          }
          status
          expirationDate
        }
      }
    `;
  return processRequest(query);
};

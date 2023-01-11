import { ServiceStatusEnum } from '../types';
import { processRequest } from '../utils/graphql';

export const getServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  platformId?: string,
): Promise<any> => {
  let condition = '';

  if (serviceStatus) {
    condition = `, where: {status: ${serviceStatus}}`;
  } else if (buyerId) {
    condition = `, where: {buyer: "${buyerId}"}`;
  } else if (sellerId) {
    condition = `, where: {seller: "${sellerId}"}`;
  }
  platformId = platformId || import.meta.env.PLATFORM_ID;

  const query = `
    {
      services(orderBy: id, where: {platform_: {id: ${platformId}}} orderDirection: desc ${condition}) {
        id
        status
        createdAt
        uri
        buyer {
          id
          handle
        }
        seller {
          id
          handle
        }
        proposals {
          id
        }
      }
    }`;
  return processRequest(query);
};

export const getServiceById = (id: string): Promise<any> => {
  const query = `
    {
      service(id: "${id}") {
        id
        status
        createdAt
        uri
        transaction {
          id
        }
        buyer {
          id
          handle
          rating
          numReviews
        }
        seller {
          id
          handle
        }
        proposals {
          id
        }
        validatedProposal: proposals(where: {status: "Validated"}){
          id,
          rateToken {
            address
            decimals
            name
            symbol
          },
          rateAmount,
        }
      }
    }
    `;
  return processRequest(query);
};

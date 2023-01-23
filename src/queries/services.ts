import { ServiceStatusEnum } from '../types';
import { processRequest } from '../utils/graphql';

export const getServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  platformId?: string,
): Promise<any> => {
  let condition = ', where: {';
  condition += serviceStatus ? `status: "${serviceStatus}"` : '';
  condition += buyerId ? `, buyer: "${buyerId}"` : '';
  condition += sellerId ? `, seller: "${sellerId}"` : '';
  condition += platformId ? `, platform: "${platformId}"` : '';
  condition += '}';

  const query = `
    {
      services(orderBy: id, orderDirection: desc ${condition}) {
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

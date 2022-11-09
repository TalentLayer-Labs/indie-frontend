import { processRequest } from '../utils/graphql';

export const getServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
): Promise<any> => {
  let condition = '';

  if (serviceStatus) {
    condition = `, where: {status: ${serviceStatus}}`;
  } else if (buyerId) {
    condition = `, where: {buyer: "${buyerId}"}`;
  } else if (sellerId) {
    condition = `, where: {seller: "${sellerId}"}`;
  }

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
        transactionId
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
        validatedProposal: proposals(where: {status: "Validated"}){
          id,
          rateToken,
          rateAmount,
        }
      }
    }
    `;
  return processRequest(query);
};

import { processRequest } from '../utils/graphql';

export const getPaymentsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      payments(where: { service: "${serviceId}" }, orderBy: id, orderDirection: asc) {
        id
        amount
        rateToken {
          address
          decimals
          name
          symbol
        }
        paymentType
        transactionHash
      }
    }
    `;
  return processRequest(query);
};

export const getPaymentsForUser = (userId: string): Promise<any> => {
  const query = `
    {
      payments(where: {service_: {seller: "${userId}"} }){
        id, 
        rateToken {
          address
          decimals
          name
          symbol
        }
        amount
        transactionHash
        paymentType
        service {
          id, 
          uri
        }
      }
    }
    
    `;
  return processRequest(query);
};

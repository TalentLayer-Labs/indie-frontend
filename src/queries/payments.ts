import { processRequest } from '../utils/graphql';

export const getPaymentsByService = (serviceId: string, paymentType?: string): Promise<any> => {
  let condition = `where: {service: "${serviceId}"`;
  paymentType ? (condition += `, paymentType: "${paymentType}"`) : '';
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      payments(${condition}) {
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
        createdAt
        service {
          id, 
          cid
        }
      }
    }
    
    `;
  return processRequest(query);
};

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
        createdAt
      }
    }
    `;
  return processRequest(query);
};

export const getPaymentsForUser = (
  userId: string,
  numberPerPage?: number,
  offset?: number,
  startDate?: string,
  endDate?: string,
): Promise<any> => {
  const pagination = numberPerPage ? 'first: ' + numberPerPage + ', skip: ' + offset : '';

  const startDataCondition = startDate ? `, createdAt_gte: "${startDate}"` : '';
  const endDateCondition = endDate ? `, createdAt_lte: "${endDate}"` : '';

  const query = `
    {
      payments(where: {
        service_: {seller: "${userId}"}
        ${startDataCondition}
        ${endDateCondition}
      }, 
      orderBy: createdAt orderDirection: desc ${pagination} ) {
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

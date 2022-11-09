import { processRequest } from '../utils/graphql';

export const getPaymentsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      payments(where: { service: "${serviceId}" }, orderBy: id, orderDirection: asc) {
        id
        amount
        paymentType
        transactionHash
      }
    }
    `;
  return processRequest(query);
};

import { processRequest } from '../utils/graphql';
import { paymentsFields } from './fieldTypes';

export const getPaymentsByService = (serviceId: string): Promise<any> => {
  const query = `
    {
      payments(where: { service: "${serviceId}" }, orderBy: id, orderDirection: asc) {
        ${paymentsFields}
      }
    }
    `;
  return processRequest(query);
};

export const getPaymentsForUser = (userId: string): Promise<any> => {
  const query = `
    {
      payments(where: {service_: {seller: "${userId}"} }){
        ${paymentsFields}
      }
    }
    
    `;
  return processRequest(query);
};

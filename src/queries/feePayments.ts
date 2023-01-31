import { processRequest } from '../utils/graphql';

export const getFeePayments = (platformId: string): Promise<any> => {
  const query = `
    {
      feePayments(where: {platform_: {id: "${platformId}"}}) {
        id
        amount
        createdAt
        type
        token {
          id
          address
          decimals
          symbol
        }
      }
    }
    `;
  return processRequest(query);
};

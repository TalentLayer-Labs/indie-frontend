import { processRequest } from '../utils/graphql';

export const getPlatformFee = (platformId: string): Promise<any> => {
  const query = `
    {
      platform(id: ${platformId}) {
        fee
      }
    }
    `;
  return processRequest(query);
};

export const getFeesFromTransaction = (transactionId: string): Promise<any> => {
  const query = `
    {
      transaction(id: ${transactionId}) {
        protocolFee
        originPlatformFee
      }
    }
    `;
  return processRequest(query);
};

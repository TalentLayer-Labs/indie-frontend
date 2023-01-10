import { processRequest } from '../utils/graphql';

export const getProtocolAndOriginFee = (): Promise<any> => {
  const query = `
  {
    protocols {
      escrowFee
      originPlatformFee
    }
    platforms{
      fee
    }
  }
    `;

  return processRequest(query);
};

import { processRequest } from '../utils/graphql';

export const getProtocolAndOriginFee = (platformId: number): Promise<any> => {
  const query = `
  {
    protocols {
      escrowFee
      originPlatformFee
    }
    platforms(id:${platformId}){
      fee
    }
  }
    `;

  return processRequest(query);
};

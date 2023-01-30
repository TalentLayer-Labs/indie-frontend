import { processRequest } from '../utils/graphql';

export const getProtocolAndOriginFee = (platformId: number): Promise<any> => {
  const query = `
  {
    protocols {
      protocolEscrowFeeRate
      originPlatformEscrowFeeRate
    }
    platforms(id:${platformId}){
      platformEscrowFeeRate
    }
  }
    `;

  return processRequest(query);
};

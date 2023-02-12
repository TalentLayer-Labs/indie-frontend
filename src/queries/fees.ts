import { processRequest } from '../utils/graphql';

export const getProtocolAndOriginServiceFee = (originServicePlatformId: number): Promise<any> => {
  const query = `
  {
    protocols {
      protocolEscrowFeeRate
    }
    platforms(id:${originServicePlatformId}){
      originServiceFeeRate
    }
  }
    `;

  return processRequest(query);
};

export const getOriginProposalValidatedPlatformId = (
  originProposalValidatedPlatformId: number,
): Promise<any> => {
  const query = `
  {
    platforms(id:${originProposalValidatedPlatformId}){
      originValidatedProposalFeeRate
    }
  }
    `;

  return processRequest(query);
};

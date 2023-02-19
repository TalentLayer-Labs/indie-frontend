import { processRequest } from '../utils/graphql';

export const getProtocolAndPlatformsFees = (
  originServicePlatformId: number,
  originValidatedProposalPlatformId: number,
): Promise<any> => {
  const query = `
  {
    protocols {
      protocolEscrowFeeRate
    }
    servicePlatform: platforms(id:${originServicePlatformId}){
      originServiceFeeRate
    }
    proposalPlatform: platforms(id:${originValidatedProposalPlatformId}){
      originValidatedProposalFeeRate
    }
  }
    `;

  return processRequest(query);
};

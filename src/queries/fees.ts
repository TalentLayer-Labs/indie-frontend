import { processRequest } from '../utils/graphql';

export const getProtocolAndOriginFee = (platformId: string): Promise<any> => {
  const query = `
    {
      protocols(id: ${platformId}) {
        protocolFee
        originPlatformFee
      }
      {
        platforms(id: ${platformId}) {
          fee
      }
    }
    `;
  return processRequest(query);
};

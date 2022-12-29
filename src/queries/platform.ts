import { processRequest } from '../utils/graphql';

export const getPlatformDetails = (id: string | undefined): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        address
        arbitrator
        arbitrationFeeTimeout
        arbitratorExtraData
        createdAt
        fee
        id
        name
        uri
      }
    }
    `;
  return processRequest(query);
};

export const getTotalPlatformGains = (id: string): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        totalPlatformGains {
          totalPlatformFeeGain
          totalOriginPlatformFeeGain
          token {
            id
            symbol
            name
          }
        }
      }
    }
    `;
  return processRequest(query);
};

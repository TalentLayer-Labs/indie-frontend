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
            decimals
            address
          }
        }
      }
    }
    `;
  return processRequest(query);
};

export const getPlatformClaimedFees = (id: string): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        feeClaims {
          id
          amount
          token {
            address
            symbol
          }
        }
      }
    }
    `;
  return processRequest(query);
};

import { processRequest } from '../utils/graphql';

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

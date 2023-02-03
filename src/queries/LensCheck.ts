import { processLensRequest } from '../utils/graphql';

export const getLensProfileInfo = (userAddress: string): Promise<any> => {
  const query = `
    {
      defaultProfile(request: { ethereumAddress: "${userAddress}"}) {
        id
        name
      }
    }
    `;
  return processLensRequest(query);
};

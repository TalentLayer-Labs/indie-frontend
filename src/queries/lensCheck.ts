import { processLensRequest } from '../utils/graphql';

export const getLensProfileInfo = (lensId: string): Promise<any> => {
  const query = `
    {
      profile(request: { profileId: "${lensId}"}) {
        id
        name
      }
    }
    `;
  return processLensRequest(query);
};

import { processLensRequest } from '../utils/graphql';

export const getLensProfileInfo = (userAddress: string): Promise<any> => {
  const query = `
    {
      defaultProfile(request: { ethereumAddress: "${userAddress}"}) {
        id
        name
        bio
        picture {
          ... on MediaSet {
              original {
                url
                mimeType
              }
            }
          }
        stats {
          totalFollowers
          totalFollowing
          totalPosts
          totalComments
          totalMirrors
          totalPublications
          totalCollects
        }
      }
    }
    `;
  return processLensRequest(query);
};

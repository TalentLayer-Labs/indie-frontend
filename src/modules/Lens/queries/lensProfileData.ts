import { processLensRequest } from '../utils/graphql';

/*
 * @doc: https://api.lens.dev/ & https://docs.lens.xyz/docs/get-default-profile
 */
export const getLensProfileInfo = (userAddress: string): Promise<any> => {
  const query = `
    {
      defaultProfile(request: { ethereumAddress: "${userAddress}"}) {
        id
        name
        bio
        handle
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

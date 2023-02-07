import { processLensRequest } from '../utils/graphql';

/*
 * @doc: https://api.lens.dev/ & https://docs.lens.xyz/docs/get-publications
 */
export const getLensFeedData = (userProfileId: string): Promise<any> => {
  const query = `
    {
      publications(
        request: {
          profileId: "${userProfileId}"
          publicationTypes: [POST]
          limit: 2
        }
      ) {
        items {
          __typename
          ... on Post {
            id
            metadata {
              name
              description
              content
              media {
                original {
                  url
                  mimeType
                }
              }
              attributes {
                displayType
                traitType
                value
              }
            }
            stats {
              totalAmountOfMirrors
              totalAmountOfCollects
              totalAmountOfComments
              totalUpvotes
              totalDownvotes
            }
            createdAt
          }
        }
      } 
    }   
    `;
  return processLensRequest(query);
};

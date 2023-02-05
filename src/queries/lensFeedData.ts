import { processLensRequest } from '../utils/graphql';

export const getLensFeedData = (profileId: string): Promise<any> => {
  const query = `
    {
      publications(
        request: {
          profileId: "0x01a1ee"
          publicationTypes: [POST, COMMENT, MIRROR]
          limit: 10
        }
      ) {
        items {
          __typename
          ... on Post {
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
            createdAt
          }
        }
      } 
    }   
    `;
  return processLensRequest(query);
};

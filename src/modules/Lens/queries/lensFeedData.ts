import { processLensRequest } from '../../../utils/graphql';

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
            createdAt
          }
        }
      } 
    }   
    `;
  return processLensRequest(query);
};

import { processRequest } from '../utils/graphql';

const userInfos = `
    id
    address
    handle
    withPoh
    rating
    numReviews
    updatedAt
    createdAt
    description {
      about
      country
      headline
      id
      picture
      title
      timezone
      skills_raw
    }
  `;

export const getUsers = (platformId?: string, searchQuery?: string): Promise<any> => {
  let condition = ', where: {';
  condition += platformId ? `, platform: "${platformId}"` : '';
  condition += searchQuery ? `, description_: {skills_raw_contains_nocase: "${searchQuery}"}` : '';
  condition += '}';

  const query = `
    {
      users(orderBy: rating, orderDirection: desc ${condition}) {
        ${userInfos}
      }
    }
    `;
  return processRequest(query);
};

export const getUserById = (id: string): Promise<any> => {
  const query = `
    {
      user(id: "${id}") {
        ${userInfos}
      }
    }
    `;
  return processRequest(query);
};

export const getUserByAddress = (address: string): Promise<any> => {
  const query = `
    {
      users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
        ${userInfos}
      }
    }
    `;
  return processRequest(query);
};

export const getUserTotalGains = (id: string): Promise<any> => {
  const query = `
    {
      user(id: "${id}") {
        totalGains{
          id
          totalGain
          token {
            id
            name
          }
        }
      }
    }
    `;
  return processRequest(query);
};

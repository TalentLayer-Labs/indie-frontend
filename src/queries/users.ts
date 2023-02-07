import { processRequest } from '../utils/graphql';

export const getUsers = (platformId?: string): Promise<any> => {
  const query = `
    {
      users(orderBy: rating, orderDirection: desc, where : { platform: "${platformId}" }) {
        id
        address
        handle
        withPoh
        numReviews
        rating
      }
    }
    `;
  return processRequest(query);
};

export const getUserById = (id: string): Promise<any> => {
  const query = `
    {
      user(id: "${id}") {
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
      }
    }
    `;
  return processRequest(query);
};

export const getUserByAddress = (address: string): Promise<any> => {
  const query = `
    {
      users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
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

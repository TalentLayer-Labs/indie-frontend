import { processRequest } from '../utils/graphql';

export const getUsers = (platformId?: string): Promise<any> => {
  const query = `
    {
      users(orderBy: rating, orderDirection: desc, where : { platform: "${platformId}" }) {
        id
        address
        cid
        handle
        lensID
        lensHandle
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
        cid
        handle
        lensID
        lensHandle
        withPoh
        rating
        numReviews
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
        cid
        handle
        lensID
        lensHandle
        withPoh
        rating
        numReviews
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

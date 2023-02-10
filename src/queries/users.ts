import { processRequest } from '../utils/graphql';
import { userFields } from './fieldTypes';

export const getUsers = (platformId?: string, searchQuery?: string): Promise<any> => {
  let condition = ', where: {';
  condition += platformId ? `, platform: "${platformId}"` : '';
  condition += searchQuery ? `, description_: {skills_raw_contains_nocase: "${searchQuery}"}` : '';
  condition += '}';

  const query = `
    {
      users(orderBy: rating, orderDirection: desc ${condition}) {
        ${userFields}
      }
    }
    `;
  return processRequest(query);
};

export const getUserById = (id: string): Promise<any> => {
  const query = `
    {
      user(id: "${id}") {
        ${userFields}
      }
    }
    `;
  return processRequest(query);
};

export const getUserByAddress = (address: string): Promise<any> => {
  const query = `
    {
      users(where: {address: "${address.toLocaleLowerCase()}"}, first: 1) {
        ${userFields}
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

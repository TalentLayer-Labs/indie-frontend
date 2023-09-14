import { processRequest } from '../utils/graphql';
import { Web3mailPreferences } from '../types';

export const getUsers = (
  numberPerPage?: number,
  offset?: number,
  searchQuery?: string,
): Promise<any> => {
  const pagination = numberPerPage ? 'first: ' + numberPerPage + ', skip: ' + offset : '';
  let condition = ', where: {';
  condition += searchQuery ? `, handle_contains_nocase: "${searchQuery}"` : '';
  condition += '}';

  const query = `
    {
      users(orderBy: rating, orderDirection: desc ${pagination} ${condition}) {
        id
        address
        handle
        userStats {
          numReceivedReviews
        }
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
        rating
        delegates
        userStats {
          numReceivedReviews
        }
        updatedAt
        createdAt
        description {
          about
          role
          name
          country
          headline
          id
          image_url
          video_url
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
        rating
        delegates
        userStats {
          numReceivedReviews
        }
        updatedAt
        createdAt
        description {
          about
          role
          name
          country
          headline
          id
          image_url
          video_url
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
            symbol
            decimals
          }
        }
      }
    }
    `;
  return processRequest(query);
};

export const getUserWeb3mailPreferences = (
  platformId: string,
  address: string,
  web3mailPreference: Web3mailPreferences,
): Promise<any> => {
  const query = `
    {
      user(address: "${address}, service_: {platform: "${platformId}"}) {
        description{
          web3mailPreferences {
            ${web3mailPreference}
        }
      }
    }
    `;
  return processRequest(query);
};

export const getUserWeb3mailPreferencesForNewServices = (
  platformId: string,
  address: string,
  web3mailPreference: Web3mailPreferences,
): Promise<any> => {
  const query = `
    {
      user(address: "${address}, service_: {platform: "${platformId}"}) {
        id
        description{
          skills_raw
          web3mailPreferences {
            ${web3mailPreference}
        }
      }
    }
    `;
  return processRequest(query);
};

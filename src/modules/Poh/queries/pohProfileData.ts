import { processPohRequest } from '../utils/graphql';

/*
 * @doc: https://api.thegraph.com/subgraphs/name/kleros/proof-of-humanity-mainnet || https://api.poh.dev/docs/static/index.html#/profiles/get_profiles
 */
export const getPohProfileInfo = (userAddress: string): Promise<any> => {
  const query = `
  {
    submission(id: "${userAddress}") {
      id
      creationTime
      registered
    }
  }
    `;
  return processPohRequest(query);
};

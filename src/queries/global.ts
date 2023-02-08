import { processRequest } from '../utils/graphql';

export const graphIsSynced = async (entity: string, cid: string): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    const interval = setInterval(async () => {
      const response = await checkEntityByUri(entity, cid);
      if (response?.data?.data?.[entity][0]) {
        clearInterval(interval);
        resolve(response?.data?.data?.[entity][0].id);
      }
    }, 5000);
  });
};

export const checkEntityByUri = (entity: string, cid: string): Promise<any> => {
  const query = `
      {
        ${entity}(where: {cid: "${cid}"}, first: 1) {
          id
          cid
        }
      }
      `;
  return processRequest(query);
};

export const getAllowedTokenList = (): Promise<any> => {
  const query = `
      {
         tokens(where: {allowed: true}) {
            address
            symbol
            name
            decimals
        }
      }
      `;
  return processRequest(query);
};

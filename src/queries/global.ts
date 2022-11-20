import { processRequest } from '../utils/graphql';

export const graphIsSynced = async (entity: string, uri: string): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    const interval = setInterval(async () => {
      const response = await checkEntityByUri(entity, uri);
      if (response?.data?.data?.[entity][0]) {
        clearInterval(interval);
        resolve(response?.data?.data?.[entity][0].id);
      }
    }, 5000);
  });
};

export const checkEntityByUri = (entity: string, uri: string): Promise<any> => {
  const query = `
      {
        ${entity}(where: {uri: "${uri}"}, first: 1) {
          id
          uri
        }
      }
      `;
  return processRequest(query);
};

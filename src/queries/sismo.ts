import { processRequest, processSismoRequest } from '../utils/graphql';

export const getSismoGroupSnapshot = async (groupId?: string): Promise<any> => {
  let condition = ', where: {';
  condition += groupId ? `, id: "${groupId}"` : '';
  condition += '}';

  const query = `
    {
      groups(${condition}) {
        description
        id
        latestSnapshot {
          dataUrl
        }
      }
    }
    `;

  //   const query = `
  // query {
  //   mintedBadges {
  //     level
  //     badge {
  //       tokenId
  //     }
  //     badge {
  //       name
  //     }
  //   }
  // }`;
  //   return await fetch('https://api.sismo.io', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //     body: JSON.stringify({ query }),
  //   });

  return processSismoRequest(query);
};

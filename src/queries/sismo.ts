import { processSismoRequest } from '../utils/graphql';

export const getSismoGroupSnapshot = async (groupId: string): Promise<any> => {
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
        name
        specs
      }
    }
    `;

  return processSismoRequest(query);
};
export const getSismoGroupSnapshotUrl = async (groupId: string): Promise<any> => {
  let condition = ', where: {';
  condition += groupId ? `, id: "${groupId}"` : '';
  condition += '}';

  const query = `
    {
      groups(${condition}) {
        latestSnapshot {
          dataUrl
        }
      }
    }
    `;

  return processSismoRequest(query);
};

export const getSismoBadgesPerAddress = async (address: string): Promise<any> => {
  let condition = ', where: {';
  condition += address ? `, id: "${address}"` : '';
  condition += '}';

  const query = `
    {
      accounts(${condition}) {
        mintedBadges {
          badge {
            name
            image
          }
        }
      }
    }
    `;

  return processSismoRequest(query);
};

// export const getSismoGroupsSnapshot = async (groupIds: string[]): Promise<any> => {
//   let condition = ', where: {';
//   condition += groupId ? `, id: "${groupId}"` : '';
//   condition += '}';
//
//   const query = `
//     {
//       groups(${condition}) {
//         description
//         id
//         latestSnapshot {
//           dataUrl
//         }
//         name
//         specs
//       }
//     }
//     `;
//
//   return processSismoRequest(query);
// };

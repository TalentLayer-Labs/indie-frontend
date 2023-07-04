import { processSismoRequest } from '../utils/graphql';

export const getSismoGroupSnapshot = async (groupId: string): Promise<any> => {
  const condition = `, where: {
      ${groupId ? `, id: "${groupId}"` : ''}
    }
  `;

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
  const condition = `, where: {
      ${groupId ? `, id: "${groupId}"` : ''}
    }
  `;

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
  const condition = `, where: {
    ${address ? `, id: "${address}"` : ''}
  }`;

  const query = `
    {
      accounts(${condition}) {
        mintedBadges {
          badge {
            name
            image
            description,
          }
        }
      }
    }
    `;

  return processSismoRequest(query);
};

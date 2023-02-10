import { processRequest } from '../utils/graphql';
import { proposalsFields } from './fieldTypes';

export const getAllProposalsbyServiceId = (id: string): Promise<any> => {
  const query = `
    {
      proposals(where: {service_: {id: "${id}"}}) {
        ${proposalsFields}
      }
    }
    `;
  return processRequest(query);
};

export const getAllProposalsByUser = (id: string): Promise<any> => {
  const query = `
      {
        proposals(where: {seller: "${id}", status: "Pending"}) {
          ${proposalsFields}
        }
      }
    `;
  return processRequest(query);
};

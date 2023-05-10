import { processRequest } from '../utils/graphql';

export const getEvidencesByPartyAndTransaction = (transactionId: string): Promise<any> => {
  let condition = `where: transaction_: {id: "${transactionId}"}}"`;
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      evidences(${condition}) {
        id
        uri
        transaction
        party {
          id
          handle
        }
      }
    }
    `;
  return processRequest(query);
};

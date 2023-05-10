import { processRequest } from '../utils/graphql';

export const getEvidencesByPartyAndTransaction = (
  transactionId: string,
  partyId: string,
): Promise<any> => {
  let condition = `where: {party_: {id:"${partyId}} transaction_: {id: "${transactionId}"}}"`;
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      evidences(${condition}) {
        id
        uri
      }
    }
    `;
  return processRequest(query);
};

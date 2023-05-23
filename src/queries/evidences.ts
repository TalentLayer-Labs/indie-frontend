import { processRequest } from '../utils/graphql';

export const getEvidencesTransactionId = (transactionId: string): Promise<any> => {
  let condition = `where: {transaction_: {id: "${transactionId}"}`;
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      evidences(${condition}) {
        id
        uri
        party {
          id
        }
      }
    }
    `;
  return processRequest(query);
};

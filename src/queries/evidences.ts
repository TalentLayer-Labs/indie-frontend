import { processRequest } from '../utils/graphql';

export const getEvidencesTransactionId = (transactionId: string): Promise<any> => {
  let condition = `where: {transaction_: {id: "${transactionId}"}`;
  condition += '}, orderBy: id, orderDirection: asc';
  const query = `
    {
      evidences(${condition}) {
        id
        cid
        party {
          id
        }
        description {
          name
          fileTypeExtension
          description
          fileUri
        }
      }
    }
    `;
  return processRequest(query);
};

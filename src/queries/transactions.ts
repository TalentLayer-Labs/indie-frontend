import { processRequest } from '../utils/graphql';

export const getTransactionById = (id: string): Promise<any> => {
  const query = `
      {
        transactions (where: {id: "${id}"}) {
          sender {
            id
          }
          receiver {
            id
          }
          arbitrationFeeTimeout
          amount
          disputeId
          senderFee
          receiverFee
          lastInteraction
          senderFeePaidAt
          receiverFeePaidAt
          arbitrator
          status
          evidences {
            uri
            party {
              address
              createdAt
              handle
              id
            }
          }
        }
      }
    `;
  return processRequest(query);
};

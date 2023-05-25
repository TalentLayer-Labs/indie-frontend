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
            handle
            address
          }
          token {
            decimals
            symbol
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
          ruling
          evidences {
            cid
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

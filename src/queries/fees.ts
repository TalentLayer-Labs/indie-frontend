import { processRequest } from '../utils/graphql';

export const getPlatformFee = (id: string): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
       fee
      }
    }
    `;
  return processRequest(query);
};

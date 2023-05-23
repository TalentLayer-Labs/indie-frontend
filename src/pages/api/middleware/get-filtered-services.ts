import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../queries/services';
import keywords from './filter.json'; // Import keywords from JSON file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.body;

  const { serviceStatus, buyerId, sellerId, numberPerPage, offset } = query;

  // Access the keywords array directly from the imported object
  const response = await getServices({
    serviceStatus,
    buyerId,
    sellerId,
    numberPerPage,
    offset,
  });

  res.status(200).json({ response });
}

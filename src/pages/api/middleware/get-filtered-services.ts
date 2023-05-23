import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../queries/services';
import keywordFilter from './filter.json'; // Import keywords from JSON file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.body;

  const { serviceStatus, buyerId, sellerId, numberPerPage, offset } = query;

  let response = await getServices({
    serviceStatus,
    buyerId,
    sellerId,
    numberPerPage,
    offset,
  });

  // Filter response data based on keywords
  response = response.data.filteredServices.filter(service => {
    // Check if any of the service's keywords exist in the keywordFilter.keywords array
    return service.keywords.some(keyword => keywordFilter.keywords.includes(keyword));
  });

  res.status(200).json({ data: response });
}

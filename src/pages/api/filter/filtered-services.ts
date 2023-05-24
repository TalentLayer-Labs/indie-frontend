import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../queries/services';
import keywordFilter from './filter.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.body;

  const { serviceStatus, buyerId, sellerId, numberPerPage, offset } = query;

  try {
    let response = await getServices({
      serviceStatus,
      buyerId,
      sellerId,
      numberPerPage,
      offset,
    });

    const filteredServices = response?.data?.data?.services;

    let keywordFilteredServices = filteredServices;

    if (keywordFilter.keywords.length > 0) {
      keywordFilteredServices = filteredServices.filter((service: any) =>
        keywordFilter.keywords.includes(service.description.keywords_raw),
      );
    }

    res.status(200).json({ data: keywordFilteredServices });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

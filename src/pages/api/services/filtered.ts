import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../queries/services';
import keywordFilter from './filter.json';
import { ServiceStatusEnum } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;

  // @dev : here you can add the filter logic
  let keywordList = keywordFilter.keywords;

  const getStringValue = (value: string | string[] | undefined): string | undefined => {
    return typeof value === 'string' ? value : undefined;
  };

  const getNumberValue = (value: string | string[] | undefined): number | undefined => {
    return value ? Number(value) : undefined;
  };

  const serviceStatus = getStringValue(query.serviceStatus) as ServiceStatusEnum;
  const buyerId = getStringValue(query.buyerId);
  const sellerId = getStringValue(query.sellerId);
  const numberPerPage = getNumberValue(query.numberPerPage);
  const offset = getNumberValue(query.offset);

  try {
    let response = await getServices({
      serviceStatus,
      buyerId,
      sellerId,
      numberPerPage,
      offset,
      keywordList,
    });

    const filteredServices = response?.data?.data?.services;

    res.status(200).json({ services: filteredServices });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

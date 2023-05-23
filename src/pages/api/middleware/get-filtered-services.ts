import type { NextApiRequest, NextApiResponse } from 'next';

import { getServices } from '../../../queries/services';
import { ServiceStatusEnum } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.body;

  const { serviceStatus, buyerId, sellerId, numberPerPage, offset } = query;

  const response = await getServices({
    serviceStatus,
    buyerId,
    sellerId,
    numberPerPage,
    offset,
  });

  res.status(200).json({ response });
}

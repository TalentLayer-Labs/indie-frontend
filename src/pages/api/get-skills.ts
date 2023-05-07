import type { NextApiRequest, NextApiResponse } from 'next';
import { getWorkXSkills } from '../../modules/WorkX/queries/global';

export default async function getSkills(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { name } = query;
  const response = await getWorkXSkills(name as string);
  const skills = response?.data?.data?.indicatorFind;
  res.status(200).json({ skills });
}

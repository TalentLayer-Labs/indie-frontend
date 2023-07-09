import { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../../config';
import TalentLayerReview from '../../../contracts/ABI/TalentLayerReview.json';
import { getDelegationSigner, isPlatformAllowedToDelegate } from '../utils/delegate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userAddress, serviceId, uri, valuesRating } = req.body;

  // @dev : you can add here all the checks you need to confirm the delegation for a user
  await isPlatformAllowedToDelegate(userAddress, res);

  try {
    const walletClient = await getDelegationSigner(res);

    if (!walletClient) {
      return;
    }

    const talentLayerReview = new Contract(
      config.contracts.talentLayerReview,
      TalentLayerReview.abi,
      walletClient,
    );
    const transaction = await talentLayerReview.mint(userId, serviceId, uri, valuesRating);

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

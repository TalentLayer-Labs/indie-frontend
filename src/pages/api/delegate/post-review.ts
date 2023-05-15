// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../../config';
import TalentLayerReview from '../../../contracts/ABI/TalentLayerReview.json';
import { getUserByAddress } from '../../../queries/users';
import { handleDelegateActivation } from './getDelegationSigner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userAddress, serviceId, uri, valuesRating } = req.body;
  let signer;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  try {
    const signer = await handleDelegateActivation(userAddress, res);

    if (!signer) {
      return;
    }

    const talentLayerReview = new Contract(
      config.contracts.talentLayerReview,
      TalentLayerReview.abi,
      signer,
    );
    const transaction = await talentLayerReview.mint(userId, serviceId, uri, valuesRating);

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

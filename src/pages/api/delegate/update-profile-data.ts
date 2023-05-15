// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'ethers';
import { config } from '../../../config';
import TalentLayerID from '../../../contracts/ABI/TalentLayerID.json';
import { handleDelegateActivation } from '../utils/getDelegationSigner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userAddress, cid } = req.body;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  try {
    const signer = await handleDelegateActivation(userAddress, res);

    if (!signer) {
      return;
    }

    const talentLayerID = new Contract(config.contracts.talentLayerId, TalentLayerID.abi, signer);
    const transaction = await talentLayerID.updateProfileData(userId, cid);

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

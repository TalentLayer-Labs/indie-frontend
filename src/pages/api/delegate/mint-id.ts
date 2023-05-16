// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'ethers';
import { config } from '../../../config';
import TalentLayerID from '../../../contracts/ABI/TalentLayerID.json';
import { getDelegationSigner } from '../utils/delegate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { handle, handlePrice, userAddress } = req.body;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  try {
    if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT !== 'true') {
      res.status(500).json('Delegation is not activated');
      return null;
    }

    const signer = await getDelegationSigner(res);

    if (!signer) {
      return;
    }

    const talentLayerID = new Contract(config.contracts.talentLayerId, TalentLayerID.abi, signer);
    const transaction = await talentLayerID.mintForAddress(
      userAddress,
      process.env.NEXT_PUBLIC_PLATFORM_ID,
      handle,
      {
        value: handlePrice,
      },
    );

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

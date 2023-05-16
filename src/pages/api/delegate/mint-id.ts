// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'ethers';
import { config } from '../../../config';
import TalentLayerID from '../../../contracts/ABI/TalentLayerID.json';
import { handleDelegateForMint } from '../utils/getDelegationSigner';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { handle, handlePrice, userAddress } = req.body;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  console.log('userAddress', userAddress);

  try {
    const signer = await handleDelegateForMint(userAddress, res);

    if (!signer) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT) {
      return res.status(500).json('delegate minting is not active');
    }

    console.log('handle', handle);

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
    res.status(500).json('tx failed');
  }
}

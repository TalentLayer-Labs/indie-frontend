// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'ethers';
import { config } from '../../../config';
import TalentLayerEscrow from '../../../contracts/ABI/TalentLayerEscrow.json';
import { getDelegationSigner, isPlatformAllowedToDelegate } from '../utils/delegate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userAddress, profileId, transactionId, amount, isBuyer } = req.body;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  await isPlatformAllowedToDelegate(userAddress, res);

  try {
    const signer = await getDelegationSigner(res);

    if (!signer) {
      return;
    }

    const talentLayerEscrow = new Contract(
      config.contracts.talentLayerEscrow,
      TalentLayerEscrow.abi,
      signer,
    );

    let transaction;
    if (isBuyer) {
      transaction = await talentLayerEscrow.release(profileId, transactionId, amount);
    } else {
      transaction = await talentLayerEscrow.reimburse(profileId, transactionId, amount);
    }

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

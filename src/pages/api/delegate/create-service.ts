import { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../../config';
import TalentLayerService from '../../../contracts/ABI/TalentLayerService.json';
import { getServiceSignature } from '../../../utils/signature';
import { getDelegationSigner, isPlatformAllowedToDelegate } from '../utils/delegate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userAddress, cid } = req.body;

  // @dev : you can add here all the checks you need to confirm the delegation for a user
  await isPlatformAllowedToDelegate(userAddress, res);

  try {
    const walletClient = await getDelegationSigner(res);
    if (!walletClient) {
      return;
    }

    const signature = await getServiceSignature({ profileId: Number(userId), cid });
    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      walletClient,
    );

    const transaction = await serviceRegistryContract.createService(
      userId,
      process.env.NEXT_PUBLIC_PLATFORM_ID,
      cid,
      signature,
    );

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

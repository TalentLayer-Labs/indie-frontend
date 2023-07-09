import { NextApiRequest, NextApiResponse } from 'next';
import { config } from '../../../config';
import TalentLayerService from '../../../contracts/ABI/TalentLayerService.json';
import { getProposalSignature } from '../../../utils/signature';
import { getDelegationSigner, isPlatformAllowedToDelegate } from '../utils/delegate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    userId,
    userAddress,
    serviceId,
    valuesRateToken,
    parsedRateAmountString,
    cid,
    convertExpirationDateString,
    existingProposalStatus,
  } = req.body;

  // @dev : you can add here all the checks you need to confirm the delegation for a user
  await isPlatformAllowedToDelegate(userAddress, res);

  try {
    const walletClient = await getDelegationSigner(res);

    if (!walletClient) {
      return;
    }

    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      walletClient,
    );

    let transaction;

    if (existingProposalStatus) {
      transaction = await serviceRegistryContract.updateProposal(
        userId,
        serviceId,
        valuesRateToken,
        parsedRateAmountString,
        cid,
        convertExpirationDateString,
      );
    } else {
      const signature = await getProposalSignature({
        profileId: Number(userId),
        cid,
        serviceId: Number(serviceId),
      });

      transaction = await serviceRegistryContract.createProposal(
        userId,
        serviceId,
        valuesRateToken,
        parsedRateAmountString,
        process.env.NEXT_PUBLIC_PLATFORM_ID,
        cid,
        convertExpirationDateString,
        signature,
      );
    }

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract } from 'ethers';
import { config } from '../../../config';
import TalentLayerService from '../../../contracts/ABI/TalentLayerService.json';
import { getServiceSignature } from '../../../utils/signature';
import { handleDelegateActivation } from '../utils/getDelegationSigner';

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

  // @dev : you can add here all the check you need to confirm the delagation for a user

  try {
    const signer = await handleDelegateActivation(userAddress, res);

    if (!signer) {
      return;
    }
    const signature = await getServiceSignature({ profileId: Number(userId), cid });

    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      signer,
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

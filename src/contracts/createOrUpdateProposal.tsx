import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { config } from '../config';
import ServiceRegistry from './ABI/TalentLayerService.json';
import { getProposalSignature } from '../utils/signature';
import { delegateCreateOrUpdateProposal } from '../components/request';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';
import { NextRouter } from 'next/router';
import { Provider } from '@wagmi/core';

export const getServiceContract = (signer: Signer): Contract => {
  return new ethers.Contract(config.contracts.serviceRegistry, ServiceRegistry.abi, signer);
};
export const createOrUpdateProposal = async (
  signer: Signer,
  provider: Provider,
  router: NextRouter,
  userId: string,
  userAddress: string,
  referrerId: string,
  serviceId: string,
  expirationDate: string,
  existingProposal: boolean,
  rateAmount: BigNumber,
  cid: string,
  isActiveDelegate: boolean,
  setSubmitting: (isSubmitting: boolean) => void,
  resetForm: () => void,
): Promise<void> => {
  try {
    const contract = getServiceContract(signer);

    // Get platform signature
    const signature = await getProposalSignature({
      profileId: Number(userId),
      cid,
      serviceId: Number(serviceId),
    });

    let tx;

    if (isActiveDelegate) {
      const response = await delegateCreateOrUpdateProposal(
        userId,
        userAddress,
        serviceId,
        rateAmount.toString(),
        cid,
        expirationDate,
        existingProposal,
        referrerId,
      );
      tx = response.data.transaction;
    } else {
      tx = existingProposal
        ? await contract.updateProposal(
            userId,
            serviceId,
            rateAmount,
            cid,
            expirationDate,
            referrerId,
          )
        : await contract.createProposal(
            userId,
            serviceId,
            rateAmount,
            process.env.NEXT_PUBLIC_PLATFORM_ID,
            cid,
            expirationDate,
            signature,
            referrerId,
          );
    }

    await createMultiStepsTransactionToast(
      {
        pending: `${existingProposal ? 'Updating' : 'Creating'} your proposal...`,
        success: `Congrats! Your proposal has been${existingProposal ? 'updated' : 'created'}`,
        error: `An error occurred while${existingProposal ? 'updating' : 'creating'} your proposal`,
      },
      provider,
      tx,
      'proposal',
      cid,
    );
    setSubmitting(false);
    resetForm();
    router.back();
  } catch (error) {
    showErrorTransactionToast(error);
  }
};

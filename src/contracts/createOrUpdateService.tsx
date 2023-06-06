import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { config } from '../config';
import ServiceRegistry from './ABI/TalentLayerService.json';
import { getServiceSignature } from '../utils/signature';
import {
  delegateCreateService,
  delegateCreateServiceWithReferral,
  delegateUpdateService,
} from '../components/request';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';
import { NextRouter } from 'next/router';
import { Provider } from '@wagmi/core';

export const getServiceContract = (signer: Signer): Contract => {
  // TODO Mumbai upgrade contracts
  // TODO Then deploy new graph
  return new ethers.Contract(config.contracts.serviceRegistry, ServiceRegistry.abi, signer);
};
export const createOrUpdateService = async (
  signer: Signer,
  provider: Provider,
  router: NextRouter,
  userId: string,
  userAddress: string,
  existingServiceId: string | undefined,
  referralAmount: BigNumber,
  token: string,
  cid: string,
  isActiveDelegate: boolean,
  setSubmitting: (isSubmitting: boolean) => void,
  resetForm: () => void,
): Promise<void> => {
  const ZERO = BigNumber.from(0);
  try {
    const contract = getServiceContract(signer);

    // Get platform signature
    const signature = await getServiceSignature({ profileId: Number(userId), cid });

    let tx;

    if (isActiveDelegate) {
      const response = existingServiceId
        ? await delegateUpdateService(
            userId,
            userAddress,
            existingServiceId,
            referralAmount,
            token,
            cid,
          )
        : referralAmount === ZERO
        ? await delegateCreateService(userId, userAddress, cid, token)
        : await delegateCreateServiceWithReferral(userId, userAddress, cid, token, referralAmount);
      tx = response.data.transaction;
    } else {
      tx = existingServiceId
        ? await contract.updateService(userId, existingServiceId, referralAmount, token, cid)
        : referralAmount === ZERO
        ? await contract.createService(
            userId,
            process.env.NEXT_PUBLIC_PLATFORM_ID,
            cid,
            signature,
            token,
          )
        : await contract.createServiceWithReferral(
            userId,
            process.env.NEXT_PUBLIC_PLATFORM_ID,
            cid,
            signature,
            token,
            referralAmount,
          );
    }

    const newId = await createMultiStepsTransactionToast(
      {
        pending: `${existingServiceId ? 'Updating' : 'Creating'} your job...`,
        success: `Congrats! Your job has been ${existingServiceId ? 'updated' : 'created'} !`,
        error: `An error occurred while ${existingServiceId ? 'Updating' : 'Creating'} your job`,
      },
      provider,
      tx,
      'service',
      cid,
    );
    setSubmitting(false);
    resetForm();
    if (newId) {
      router.push(`/services/${newId}`);
    }
  } catch (error) {
    showErrorTransactionToast(error);
  }
};

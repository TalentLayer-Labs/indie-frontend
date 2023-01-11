import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { BigNumber, Contract, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TalentLayerPlatformID from './ABI/TalentLayerPlatformID.json';
import { Provider } from '@wagmi/core';
import * as config from '../config';

export const getPlatformId = async (signer: Signer, provider: Provider): Promise<number | null> => {
  if (!signer || !provider) {
    return null;
  }
  const talentLayerPlatformId = new Contract(
    config.config.contracts.talentLayerPlatformId,
    TalentLayerPlatformID.abi,
    signer,
  );

  let associatedPlatformId = null;

  try {
    const ethAddress = await signer.getAddress();
    associatedPlatformId =
      (await talentLayerPlatformId.getPlatformIdFromAddress(ethAddress)) || null;

    if (associatedPlatformId.eq(BigNumber.from(0))) {
      return null;
    }
  } catch (error: any) {
    let errorMessage;
    if (typeof error?.code === 'string') {
      const parsedEthersError = getParsedEthersError(error as EthersError);
      errorMessage = `${parsedEthersError.errorCode} - ${parsedEthersError.context}`;
    } else {
      errorMessage = error?.message;
    }
    toast.error(errorMessage);
  }
  console.log('associatedPlatformId', associatedPlatformId);
  return associatedPlatformId;
};

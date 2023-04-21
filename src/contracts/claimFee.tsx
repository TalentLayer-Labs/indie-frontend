import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { Provider } from '@wagmi/core';
import { Contract, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TalentLayerPlatformID from './ABI/TalentLayerPlatformID.json';
import { config } from '../config';
import TransactionToast from '../components/TransactionToast';

export const claimFee = async (
  signer: Signer,
  provider: Provider,
  platformId: string,
  tokenAddress: string,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerPlatformID.abi,
    signer,
  );

  const handleTxInToast = async (
    tx: any,
    provider: Provider,
    messages: { pending: string; success: string; error: string },
  ) => {
    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: {
        render() {
          return <TransactionToast message={messages.pending} transactionHash={tx.hash} />;
        },
      },
      success: messages.success,
      error: messages.error,
    });
    if (receipt.status !== 1) {
      throw new Error(messages.error);
    }
  };

  const handleTxErrors = (error: any) => {
    let errorMessage;
    if (typeof error?.code === 'string') {
      const parsedEthersError = getParsedEthersError(error as EthersError);
      errorMessage = `${parsedEthersError.errorCode} - ${parsedEthersError.context}`;
    } else {
      errorMessage = error?.message;
    }
    toast.error(errorMessage);
  };

  try {
    const protocolFee = await talentLayerEscrow.protocolFee();
    console.log('protocolFee', protocolFee);
    const tx = await talentLayerEscrow.claim(platformId, tokenAddress);
    await handleTxInToast(tx, provider, {
      pending: 'Claiming fee',
      success: 'Fee claimed',
      error: 'An error occurred while claiming fee',
    });
  } catch (error: any) {
    handleTxErrors(error);
  }
};

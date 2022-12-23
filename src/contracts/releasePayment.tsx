import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { Provider } from '@wagmi/core';
import { BigNumber, Contract, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';

export const releasePayment = async (
  signer: Signer,
  provider: Provider,
  transactionId: string,
  amount: BigNumber,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    signer,
  );

  try {
    const tx = await talentLayerEscrow.release(parseInt(transactionId, 10), amount.toString());

    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: {
        render() {
          return (
            <TransactionToast
              message='Your payment release is in progress'
              transactionHash={tx.hash}
            />
          );
        },
      },
      success: 'Payment release validated',
      error: 'An error occurred while validating your transaction',
    });
    if (receipt.status !== 1) {
      throw new Error('Approve Transaction failed');
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
};

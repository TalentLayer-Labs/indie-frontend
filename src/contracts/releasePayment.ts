import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { Provider } from '@web3modal/ethereum';
import { BigNumber, Contract, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TalentLayerMultipleArbitrableTransaction from './ABI/TalentLayerMultipleArbitrableTransaction.json';

export const releasePayment = async (
  signer: Signer,
  provider: Provider,
  transactionId: string,
  amount: BigNumber,
): Promise<void> => {
  const talentLayerMultipleArbitrableTransaction = new Contract(
    '0x64A705B5121F005431574d3F23159adc230B0041',
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  try {
    console.log({
      transactionId: parseInt(transactionId, 10),
      amount: amount.toString(),
    });
    const tx = await talentLayerMultipleArbitrableTransaction.release(
      parseInt(transactionId, 10),
      amount.toString(),
    );

    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: 'Your payment release is in progress',
      success: 'Payment realse validated',
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

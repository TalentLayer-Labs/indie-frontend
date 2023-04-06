import { Provider } from '@wagmi/core';
import { BigNumber, Contract, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { showErrorTransactionToast } from '../utils/toast';

export const releasePayment = async (
  signer: Signer,
  provider: Provider,
  profileId: string,
  transactionId: string,
  amount: BigNumber,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    signer,
  );

  try {
    const tx = await talentLayerEscrow.release(
      profileId,
      parseInt(transactionId, 10),
      amount.toString(),
    );

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
    showErrorTransactionToast(error);
  }
};

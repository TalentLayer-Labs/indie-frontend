import { Provider } from '@wagmi/core';
import { BigNumber, Contract, Signer, ethers } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { showErrorTransactionToast } from '../utils/toast';
import { delegateReleaseOrReimburse } from '../components/request';

export const executePayment = async (
  userAddress: string,
  signer: Signer,
  provider: Provider,
  profileId: string,
  transactionId: string,
  amount: BigNumber,
  isBuyer: boolean,
  isActiveDelegate: boolean,
): Promise<void> => {
  try {
    let tx: ethers.providers.TransactionResponse;

    if (isActiveDelegate) {
      const response = await delegateReleaseOrReimburse(
        userAddress,
        profileId,
        parseInt(transactionId, 10),
        amount.toString(),
        isBuyer,
      );
      tx = response.data.transaction;
    } else {
      const talentLayerEscrow = new Contract(
        config.contracts.talentLayerEscrow,
        TalentLayerEscrow.abi,
        signer,
      );
      tx = isBuyer
        ? await talentLayerEscrow.release(profileId, parseInt(transactionId, 10), amount.toString())
        : await talentLayerEscrow.reimburse(
            profileId,
            parseInt(transactionId, 10),
            amount.toString(),
          );
    }

    const message = isBuyer
      ? 'Your payment release is in progress'
      : 'Your payment reimbursement is in progress';

    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: {
        render() {
          return <TransactionToast message={message} transactionHash={tx.hash} />;
        },
      },
      success: isBuyer ? 'Payment release validated' : 'Payment reimbursement validated',
      error: 'An error occurred while validating your transaction',
    });
    if (receipt.status !== 1) {
      throw new Error('Approve Transaction failed');
    }
  } catch (error: any) {
    showErrorTransactionToast(error);
  }
};

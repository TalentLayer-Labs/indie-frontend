import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { showErrorTransactionToast } from '../utils/toast';
import { delegateReleaseOrReimburse } from '../components/request';
import { PublicClient, WalletClient } from 'viem';

export const executePayment = async (
  userAddress: string,
  walletClient: WalletClient,
  publicClient: PublicClient,
  profileId: string,
  transactionId: string,
  amount: bigint,
  isBuyer: boolean,
  isActiveDelegate: boolean,
): Promise<void> => {
  try {
    let tx;

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
        walletClient,
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

    const receipt = await toast.promise(publicClient.waitForTransaction(tx.hash), {
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

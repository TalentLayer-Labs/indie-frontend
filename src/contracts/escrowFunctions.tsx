import { Provider } from '@wagmi/core';
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { showErrorTransactionToast } from '../utils/toast';
import { delegateReleaseOrReimburse } from '../components/request';

function getEscrowContract(signer: Signer) {
  return new Contract(config.contracts.talentLayerEscrow, TalentLayerEscrow.abi, signer);
}

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
      const talentLayerEscrow = getEscrowContract(signer);
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

export const claimReferralBalance = async (
  userId: string,
  tokenAddress: string,
  signer: Signer,
  provider: Provider,
): Promise<void> => {
  try {
    const talentLayerEscrow = getEscrowContract(signer);
    const tx = await talentLayerEscrow.claimReferralBalance(userId, tokenAddress);

    const message = 'Your claim is in progress';

    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: {
        render() {
          return <TransactionToast message={message} transactionHash={tx.hash} />;
        },
      },
      success: 'Claim validated',
      error: 'An error occurred while processing your claim',
    });
    if (receipt.status !== 1) {
      throw new Error('Approve Transaction failed');
    }
  } catch (error: any) {
    showErrorTransactionToast(error);
  }
};

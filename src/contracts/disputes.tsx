import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { NextRouter } from 'next/router';
import { createMultiStepsTransactionToast } from '../utils/toast';
import { PublicClient, WalletClient } from 'viem';

export const getEscrowContract = (walletClient: WalletClient): Contract => {
  return new ethers.Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    walletClient,
  );
};

export const payArbitrationFee = async (
  walletClient: WalletClient,
  publicClient: PublicClient,
  arbitrationFee: bigint,
  isSender: boolean,
  transactionId: string,
  router: NextRouter,
) => {
  if (walletClient) {
    const contract = getEscrowContract(walletClient);
    try {
      const tx = isSender
        ? await contract.payArbitrationFeeBySender(transactionId, { value: arbitrationFee })
        : await contract.payArbitrationFeeByReceiver(transactionId, { value: arbitrationFee });
      const receipt = await toast.promise(publicClient.waitForTransaction(tx.hash), {
        pending: {
          render() {
            return (
              <TransactionToast message={'Paying arbitration fees...'} transactionHash={tx.hash} />
            );
          },
        },
        success: 'Arbitration fees have been paid',
        error: 'An error occurred while paying arbitration fees',
      });
      if (receipt.status !== 1) {
        throw new Error('Transaction failed');
      }
      router.reload();
    } catch (error) {
      console.error(error);
    }
  }
};
export const arbitrationFeeTimeout = async (
  walletClient: WalletClient,
  publicClient: Provider,
  transactionId: string,
  router: NextRouter,
) => {
  if (walletClient) {
    const contract = getEscrowContract(walletClient);
    try {
      const tx = await contract.arbitrationFeeTimeout(transactionId);
      const receipt = await toast.promise(publicClient.waitForTransaction(tx.hash), {
        pending: {
          render() {
            return <TransactionToast message={'Calling timeout...'} transactionHash={tx.hash} />;
          },
        },
        success: 'The dispute has been timed-out',
        error: 'An error occurred while calling timeout',
      });
      if (receipt.status !== 1) {
        throw new Error('Transaction failed');
      }
      router.reload();
    } catch (error) {
      console.error(error);
    }
  }
};

export const submitEvidence = async (
  walletClient: WalletClient,
  publicClient: Provider,
  userId: string,
  transactionId: string,
  evidenceCid: string,
) => {
  const contract = getEscrowContract(walletClient);
  const tx = await contract.submitEvidence(userId, transactionId, evidenceCid);
  await createMultiStepsTransactionToast(
    {
      pending: 'Submitting evidence...',
      success: 'Your evidence has been submitted',
      error: 'Your evidence has been submitted',
    },
    publicClient,
    tx,
    'evidence',
    evidenceCid,
  );
};

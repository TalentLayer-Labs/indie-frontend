import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@wagmi/core';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { NextRouter } from 'next/router';

export const getEscrowContract = (signer: Signer): Contract => {
  return new ethers.Contract(config.contracts.talentLayerEscrow, TalentLayerEscrow.abi, signer);
};

export const payArbitrationFee = async (
  signer: Signer,
  provider: Provider,
  arbitrationFee: BigNumber,
  isSender: boolean,
  transactionId: string,
  router: NextRouter,
) => {
  if (signer) {
    const contract = getEscrowContract(signer);
    try {
      const tx = isSender
        ? await contract.payArbitrationFeeBySender(transactionId, { value: arbitrationFee })
        : await contract.payArbitrationFeeByReceiver(transactionId, { value: arbitrationFee });
      const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
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
  signer: Signer,
  provider: Provider,
  transactionId: string,
  router: NextRouter,
) => {
  if (signer) {
    const contract = getEscrowContract(signer);
    try {
      const tx = await contract.arbitrationFeeTimeout(transactionId);
      const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
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
  signer: Signer,
  provider: Provider,
  userId: string,
  transactionId: string,
  evidenceCid: string,
) => {
  const contract = getEscrowContract(signer);
  const tx = await contract.submitEvidence(userId, transactionId, evidenceCid);
  const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
    pending: {
      render() {
        return <TransactionToast message={'Submitting evidence...'} transactionHash={tx.hash} />;
      },
    },
    success: 'Your evidence has been submitted',
    error: 'An error occurred while submitting your evidence',
  });
  if (receipt.status !== 1) {
    throw new Error('Transaction failed');
  }
};

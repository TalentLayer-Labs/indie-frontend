import { BigNumber, Contract, ethers, Signer } from 'ethers';
import { Provider } from '@wagmi/core';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { ITransaction, IUser } from '../types';
import { NextRouter } from 'next/router';

export const getEscrowContract = (signer: Signer): Contract => {
  return new ethers.Contract(config.contracts.talentLayerEscrow, TalentLayerEscrow.abi, signer);
};

export const payArbitrationFee = async ({
  signer,
  provider,
  arbitrationFee,
  user,
  transaction,
  router,
}: {
  signer: Signer;
  provider: Provider;
  arbitrationFee: BigNumber;
  user: IUser;
  transaction: ITransaction;
  router: NextRouter;
}) => {
  if (signer) {
    const contract = getEscrowContract(signer);
    try {
      const tx =
        user?.id === transaction?.sender.id
          ? await contract.payArbitrationFeeBySender(transaction.id, { value: arbitrationFee })
          : user?.id === transaction?.receiver.id
          ? await contract.payArbitrationFeeByReceiver(transaction.id, { value: arbitrationFee })
          : '';
      const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
        pending: {
          render() {
            return <TransactionToast message={'Raising dispute...'} transactionHash={tx.hash} />;
          },
        },
        success: 'A dispute has been raised',
        error: 'An error occurred while raising the dispute',
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
export const arbitrationFeeTimeout = async ({
  signer,
  provider,
  transactionId,
  router,
}: {
  signer: Signer;
  provider: Provider;
  transactionId: string;
  router: NextRouter;
}) => {
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

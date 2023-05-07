import React, { useContext } from 'react';
import { useWeb3Modal } from '@web3modal/react';
import { Provider } from '@wagmi/core';
import { Signer, ethers } from 'ethers';
import { useProvider, useSigner } from 'wagmi';
import TalentLayerContext from '../context/talentLayer';
import TalentLayerID from './ABI/TalentLayerID.json';
import { config } from '../config';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';

export const validateDelegation = async (
  user: string,
  DelegateAddress: string,
  signer: Signer,
  provider: Provider,
): Promise<void> => {
  const isActiveDelegateEnabled = process.env.NEXT_PUBLIC_ACTIVE_DELEGATE;

  const contract = new ethers.Contract(config.contracts.talentLayerId, TalentLayerID.abi, signer);

  try {
    const tx = await contract.addDelegate(user, DelegateAddress);

    const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
      pending: {
        render() {
          return (
            <TransactionToast message='The delegation is in progress' transactionHash={tx.hash} />
          );
        },
      },
      success: 'Delegation validated',
      error: 'An error occurred while validating your transaction',
    });
    if (receipt.status !== 1) {
      throw new Error('Delegation failed');
    }
  } catch (error) {
    showErrorTransactionToast(error);
  }
};

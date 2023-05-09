import React from 'react';
import { Provider } from '@wagmi/core';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';

export const validateDelegation = async (
  user: string,
  DelegateAddress: string,
  provider: Provider,
  validateState: boolean,
  contract: ethers.Contract,
): Promise<void> => {
  try {
    let tx: ethers.providers.TransactionResponse;
    if (validateState === true) {
      tx = await contract.addDelegate(user, DelegateAddress);
    } else {
      tx = await contract.removeDelegate(user, DelegateAddress);
    }

    await createMultiStepsTransactionToast(
      {
        pending: 'Submitting the delegation...',
        success: 'Congrats! the delegation is active',
        error: 'An error occurred while delegation process',
      },
      provider,
      tx,
      'Delegation',
    );
  } catch (error) {
    showErrorTransactionToast(error);
  }
};

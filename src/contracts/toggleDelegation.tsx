import { PublicClient } from 'viem';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';

export const toggleDelegation = async (
  user: string,
  DelegateAddress: string,
  publicClient: PublicClient,
  validateState: boolean,
  contract: Contract,
): Promise<void> => {
  try {
    let tx;
    let toastMessages;
    if (validateState === true) {
      tx = await contract.addDelegate(user, DelegateAddress);
      toastMessages = {
        pending: 'Submitting the delegation...',
        success: 'Congrats! the delegation is active',
        error: 'An error occurred while delegation process',
      };
    } else {
      tx = await contract.removeDelegate(user, DelegateAddress);
      toastMessages = {
        pending: 'Canceling the delegation...',
        success: 'The delegation has been canceled',
        error: 'An error occurred while canceling the delegation',
      };
    }

    await createMultiStepsTransactionToast(toastMessages, publicClient, tx, 'Delegation');
  } catch (error) {
    showErrorTransactionToast(error);
  }
};

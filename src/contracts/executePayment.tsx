import { Provider } from '@wagmi/core';
import { BigNumber, Contract, Signer, ethers } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';
import { showErrorTransactionToast } from '../utils/toast';
import { getUserByAddress } from '../queries/users';
import { delegateReleaseOrReimburse } from '../components/request';

export const executePayment = async (
  userAddress: string,
  signer: Signer,
  provider: Provider,
  profileId: string,
  transactionId: string,
  amount: BigNumber,
  isBuyer: boolean,
): Promise<void> => {
  try {
    const getUser = await getUserByAddress(userAddress);
    const delegateAddresses = getUser.data?.data?.users[0].delegates;
    let tx: ethers.providers.TransactionResponse;

    if (
      process.env.NEXT_PUBLIC_ACTIVE_DELEGATE &&
      delegateAddresses &&
      delegateAddresses.indexOf(config.delegation.address.toLowerCase()) != -1
    ) {
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

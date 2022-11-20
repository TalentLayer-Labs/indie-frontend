import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Provider } from '@web3modal/ethereum';
import { Transaction } from 'ethers';
import { toast } from 'react-toastify';
import MultiStepsTransactionToast from '../components/MultiStepsTransactionToast';

export const graphIsSynced = async (): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
};

export const IpfsIsSynced = async (): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 15000);
  });
};

interface IMessages {
  pending: string;
  success: string;
  error: string;
}

export const createTransactionToast = async (
  messages: IMessages,
  provider: Provider,
  tx: Transaction,
): Promise<TransactionReceipt | undefined> => {
  let currentStep = 1;
  const toastId = toast(
    <MultiStepsTransactionToast
      message={messages.pending}
      transactionHash={tx.hash as string}
      currentStep={currentStep}
    />,
    { autoClose: false, closeOnClick: false },
  );

  let receipt;
  try {
    receipt = await provider.waitForTransaction(tx.hash as string);
    console.log('transactionDone', receipt);

    currentStep = 2;
    toast.update(toastId, {
      render: (
        <MultiStepsTransactionToast
          message={messages.pending}
          transactionHash={tx.hash as string}
          currentStep={currentStep}
        />
      ),
    });

    await graphIsSynced();
    console.log('graphIsSynced');

    currentStep = 3;
    toast.update(toastId, {
      render: (
        <MultiStepsTransactionToast
          message={messages.pending}
          transactionHash={tx.hash as string}
          currentStep={currentStep}
        />
      ),
    });

    await IpfsIsSynced();
    console.log('IpfsIsSynced');

    toast.update(toastId, {
      type: toast.TYPE.SUCCESS,
      render: messages.success,
      autoClose: true,
      closeOnClick: true,
    });
  } catch (error) {
    const parsedEthersError = getParsedEthersError(error as EthersError);
    console.error(error);
    toast.update(toastId, {
      type: toast.TYPE.ERROR,
      render: `${messages.error}: ${parsedEthersError.errorCode} - ${parsedEthersError.context}`,
    });
  }

  return receipt;
};

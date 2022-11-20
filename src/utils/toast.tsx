import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { Provider } from '@web3modal/ethereum';
import { Transaction } from 'ethers';
import { toast } from 'react-toastify';
import MultiStepsTransactionToast from '../components/MultiStepsTransactionToast';
import { checkEntityByUri, graphIsSynced } from '../queries/global';
import { IpfsIsSynced } from './ipfs';

interface IMessages {
  pending: string;
  success: string;
  error: string;
}

export const createMultiStepsTransactionToast = async (
  messages: IMessages,
  provider: Provider,
  tx: Transaction,
  entity: string,
  newUri: string,
): Promise<number | undefined> => {
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

    const entityId = await graphIsSynced(entity, newUri);
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

    await IpfsIsSynced(newUri);
    toast.update(toastId, {
      type: toast.TYPE.SUCCESS,
      render: messages.success,
      autoClose: 5000,
      closeOnClick: true,
    });

    return entityId;
  } catch (error) {
    const parsedEthersError = getParsedEthersError(error as EthersError);
    console.error(error);
    toast.update(toastId, {
      type: toast.TYPE.ERROR,
      render: `${messages.error}: ${parsedEthersError.errorCode} - ${parsedEthersError.context}`,
    });
  }
  return;
};

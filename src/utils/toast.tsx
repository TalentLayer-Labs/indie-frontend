import { getParsedEthersError, RETURN_VALUE_ERROR_CODES } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { Provider } from '@wagmi/core';
import { Transaction } from 'ethers';
import { toast } from 'react-toastify';
import MultiStepsTransactionToast from '../components/MultiStepsTransactionToast';
import { graphIsSynced, graphUserIsSynced } from '../queries/global';

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
  newUri?: string,
): Promise<number | undefined> => {
  let currentStep = 1;
  const toastId = toast(
    <MultiStepsTransactionToast
      transactionHash={tx.hash as string}
      currentStep={currentStep}
      hasOffchainData={!!newUri}
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
          transactionHash={tx.hash as string}
          currentStep={currentStep}
          hasOffchainData={!!newUri}
        />
      ),
    });

    if (newUri) {
      const entityId = await graphIsSynced(`${entity}s`, newUri);
      currentStep = 3;
      toast.update(toastId, {
        render: (
          <MultiStepsTransactionToast
            transactionHash={tx.hash as string}
            currentStep={currentStep}
          />
        ),
      });

      await graphIsSynced(`${entity}Descriptions`, newUri);
      toast.update(toastId, {
        type: toast.TYPE.SUCCESS,
        render: messages.success,
        autoClose: 5000,
        closeOnClick: true,
      });

      return entityId;
    }

    toast.update(toastId, {
      type: toast.TYPE.SUCCESS,
      render: messages.success,
      autoClose: 5000,
      closeOnClick: true,
    });

    return;
  } catch (error) {
    const errorMessage = getParsedErrorMessage(error);
    console.error(error);
    toast.update(toastId, {
      type: toast.TYPE.ERROR,
      render: errorMessage,
    });
  }
  return;
};

export const showErrorTransactionToast = (error: any) => {
  console.error(error);
  let errorMessage = getParsedErrorMessage(error);
  if (error.response && error.response.status === 500) {
    errorMessage = error.response.data;
  }
  toast.error(errorMessage);
};

export const createTalentLayerIdTransactionToast = async (
  messages: IMessages,
  provider: Provider,
  tx: Transaction,
  address: string,
): Promise<number | undefined> => {
  let currentStep = 1;
  const toastId = toast(
    <MultiStepsTransactionToast
      transactionHash={tx.hash as string}
      currentStep={currentStep}
      hasOffchainData={false}
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
          transactionHash={tx.hash as string}
          currentStep={currentStep}
          hasOffchainData={false}
        />
      ),
    });

    const entityId = await graphUserIsSynced(address);

    toast.update(toastId, {
      type: toast.TYPE.SUCCESS,
      render: messages.success,
      autoClose: 5000,
      closeOnClick: true,
    });

    return entityId;
  } catch (error) {
    const errorMessage = getParsedErrorMessage(error);
    console.error(error);
    toast.update(toastId, {
      type: toast.TYPE.ERROR,
      render: errorMessage,
    });
  }
  return;
};

function getParsedErrorMessage(error: any) {
  const parsedEthersError = getParsedEthersError(error as EthersError);
  if (parsedEthersError.errorCode === RETURN_VALUE_ERROR_CODES.REJECTED_TRANSACTION) {
    return `${parsedEthersError.errorCode} - user rejected transaction`;
  } else {
    return `${parsedEthersError.errorCode} - ${parsedEthersError.context}`;
  }
}

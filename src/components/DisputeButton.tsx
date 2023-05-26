import { ITransaction, IUser, TransactionStatusEnum } from '../types';
import { arbitrationFeeTimeout, payArbitrationFee } from '../contracts/disputes';
import { useProvider, useSigner } from 'wagmi';
import { useRouter } from 'next/router';
import { BigNumber } from 'ethers';

function DisputeButton({
  user,
  transaction,
  disabled,
  arbitrationFee,
  content,
}: {
  user: IUser;
  transaction: ITransaction;
  disabled: boolean;
  arbitrationFee: BigNumber;
  content?: string;
}) {
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const router = useRouter();
  const transactionId = transaction?.id;

  const isSender = (): boolean => {
    return !!user && !!transaction && user.id === transaction.sender.id;
  };

  const isReceiver = (): boolean => {
    return !!user && !!transaction && user.id === transaction.receiver.id;
  };

  const payFee = () => {
    if (signer && arbitrationFee) {
      return payArbitrationFee(signer, provider, arbitrationFee, isSender(), transactionId, router);
    }
  };
  const timeout = () => {
    if (signer) {
      return arbitrationFeeTimeout(signer, provider, transactionId, router);
    }
  };
  const userIsSenderAndHasPaid = () => {
    return isSender() && transaction.status === TransactionStatusEnum.WaitingReceiver;
  };
  const userIsSenderAndHasNotPaid = () => {
    return isSender() && transaction.status === TransactionStatusEnum.WaitingSender;
  };

  const userIsReceiverAndHasPaid = () => {
    return isReceiver() && transaction.status === TransactionStatusEnum.WaitingSender;
  };
  const userIsReceiverAndHasNotPaid = () => {
    return isReceiver() && transaction.status === TransactionStatusEnum.WaitingReceiver;
  };

  const noDispute = () => {
    return transaction.status === TransactionStatusEnum.NoDispute;
  };

  const disputeCreated = () => {
    return transaction.status === TransactionStatusEnum.DisputeCreated;
  };
  const disputeResolved = () => {
    return transaction.status === TransactionStatusEnum.Resolved;
  };

  return (
    <>
      {userIsSenderAndHasNotPaid() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white'
                }`}>
          Pay fee
        </button>
      )}
      {noDispute() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border text-center ${
            content
              ? 'cursor-pointer hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white'
              : 'text-gray-500 bg-gray-200'
          } rounded-md border-grey-600`}
          onClick={() => payFee()}>
          {content ? content : 'No dispute'}
        </button>
      )}
      {userIsReceiverAndHasPaid() ||
        (userIsSenderAndHasPaid() && (
          <button
            disabled={disabled}
            className={`px-5 py-2 mt-4 border rounded-md ${
              disabled
                ? 'text-gray-400 bg-gray-200'
                : 'hover:text-indigo-600 hover:bg-white border-indigo-600 text-white bg-indigo-700'
            }`}
            onClick={() => timeout()}>
            Timeout
          </button>
        ))}
      {userIsReceiverAndHasNotPaid() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}
          onClick={() => payFee()}>
          Pay fee
        </button>
      )}
      {disputeCreated() && (
        <span
          className={
            'ml-2 mt-4 px-5 py-2 border text-center text-gray-500 bg-gray-200 rounded-md border-grey-600'
          }>
          Waiting for arbitration...
        </span>
      )}
      {disputeResolved() && (
        <span
          className={
            'ml-2 mt-4 px-5 py-2 border text-center text-gray-500 bg-gray-200 rounded-md border-grey-600'
          }>
          Dispute resolved
        </span>
      )}
    </>
  );
}

export default DisputeButton;

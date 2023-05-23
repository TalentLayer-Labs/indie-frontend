import { TransactionStatusEnum } from '../types';

function DisputeButton({
  isSender,
  isReceiver,
  transactionStatus,
  disabled,
}: {
  isSender: boolean;
  isReceiver: boolean;
  transactionStatus: TransactionStatusEnum;
  disabled: boolean;
}) {
  const userIsSenderAndHasPaid = () => {
    return isSender && transactionStatus === TransactionStatusEnum.WaitingReceiver;
  };
  const userIsSenderAndHasNotPaid = () => {
    return isSender && transactionStatus === TransactionStatusEnum.WaitingSender;
  };

  const userIsReceiverAndHasPaid = () => {
    return isReceiver && transactionStatus === TransactionStatusEnum.WaitingSender;
  };
  const userIsReceiverAndHasNotPaid = () => {
    return isReceiver && transactionStatus === TransactionStatusEnum.WaitingReceiver;
  };

  function noDispute() {
    return transactionStatus === TransactionStatusEnum.NoDispute;
  }

  function disputeCreated() {
    return transactionStatus === TransactionStatusEnum.DisputeCreated;
  }
  function disputeResolved() {
    return transactionStatus === TransactionStatusEnum.Resolved;
  }
  //TODO Actions button: payFee, timeout
  //TODO Default display when waiting for ruling

  return (
    <>
      {userIsSenderAndHasPaid() && (
        <button
          disabled={disabled}
          className={`px-5 py-2 mt-4 border rounded-md ${
            disabled
              ? 'text-gray-400 bg-gray-200'
              : 'hover:text-indigo-600 hover:bg-white border-indigo-600 text-white bg-indigo-700'
          }`}>
          Timeout
        </button>
      )}
      {userIsSenderAndHasNotPaid() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}>
          Pay fee
        </button>
      )}
      {noDispute() && (
        <span className='ml-2 mt-4 px-5 py-2 border text-center text-gray-500 bg-gray-200 rounded-md border-grey-600'>
          No dispute
        </span>
      )}
      {userIsReceiverAndHasPaid() && (
        <button
          disabled={disabled}
          className={`px-5 py-2 mt-4 border rounded-md ${
            disabled
              ? 'text-gray-400 bg-gray-200'
              : 'hover:text-indigo-600 hover:bg-white border-indigo-600 text-white bg-indigo-700'
          }`}>
          Timeout
        </button>
      )}
      {userIsReceiverAndHasNotPaid() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}>
          Pay fee
        </button>
      )}
      {disputeCreated() && (
        <span className={'text-sm text-gray-500 mt-2 rounded-full bg-gray-200 p-2'}>
          <strong>Dispute created...</strong>
        </span>
      )}
      {disputeResolved() && (
        <span className={'text-sm text-gray-500 mt-2 rounded-full bg-gray-200 p-2'}>
          <strong>Dispute resolved...</strong>
        </span>
      )}
    </>
  );
}

export default DisputeButton;

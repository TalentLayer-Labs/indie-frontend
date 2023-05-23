import { TransactionStatusEnum } from '../types';

function DisputeButton({
  isSender,
  isReceiver,
  transactionStatus,
  disabled,
  payArbitrationFee,
  arbitrationFeeTimeout,
}: {
  isSender: boolean;
  isReceiver: boolean;
  transactionStatus: TransactionStatusEnum;
  disabled: boolean;
  payArbitrationFee: () => void;
  arbitrationFeeTimeout: () => void;
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

  const noDispute = () => {
    return transactionStatus === TransactionStatusEnum.NoDispute;
  };

  const disputeCreated = () => {
    return transactionStatus === TransactionStatusEnum.DisputeCreated;
  };
  const disputeResolved = () => {
    return transactionStatus === TransactionStatusEnum.Resolved;
  };

  return (
    <>
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
      {userIsReceiverAndHasPaid() ||
        (userIsSenderAndHasPaid() && (
          <button
            disabled={disabled}
            className={`px-5 py-2 mt-4 border rounded-md ${
              disabled
                ? 'text-gray-400 bg-gray-200'
                : 'hover:text-indigo-600 hover:bg-white border-indigo-600 text-white bg-indigo-700'
            }`}
            onClick={() => arbitrationFeeTimeout()}>
            Timeout
          </button>
        ))}
      {userIsReceiverAndHasNotPaid() && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}
          onClick={() => payArbitrationFee()}>
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

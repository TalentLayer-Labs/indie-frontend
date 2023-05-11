import { TransactionStatusEnum } from '../types';

function DisputeButton({
  userId,
  buyerId,
  sellerId,
  transactionStatus,
  disabled,
}: {
  userId: string;
  buyerId: string;
  sellerId: string;
  transactionStatus: TransactionStatusEnum;
  disabled: boolean;
}) {
  // const disabled = false;
  const userIsBuyerAndHasPaid = () => {
    return userId === buyerId && transactionStatus === TransactionStatusEnum.WaitingReceiver;
  };
  const userIsBuyerAndHasNotPaid = () => {
    return userId === buyerId && transactionStatus === TransactionStatusEnum.WaitingSender;
  };

  const userIsSellerAndHasPaid = () => {
    return userId === sellerId && transactionStatus === TransactionStatusEnum.WaitingSender;
  };
  const userIsSellerAndHasNotPaid = () => {
    return userId === sellerId && transactionStatus === TransactionStatusEnum.WaitingReceiver;
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
      {userIsBuyerAndHasPaid() && (
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
      {(userIsBuyerAndHasNotPaid() || noDispute()) && (
        <button
          className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}>
          Pay fee
        </button>
      )}
      {userIsSellerAndHasPaid() && (
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
      {(userIsSellerAndHasNotPaid() || noDispute()) && (
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

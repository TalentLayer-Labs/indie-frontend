import DisputeStatusDetail from './DisputeStatusDetail';
import { ITransaction, IUser, TransactionStatusEnum } from '../../../types';
import TimeOutCountDown from '../../../components/TimeoutCountDown';
import DisputeButton from '../../../components/DisputeButton';

function DisputeStatusCard({
  transaction,
  user,
  arbitrationFee,
}: {
  transaction: ITransaction;
  user: IUser;
  arbitrationFee: bigint;
}) {
  const isSender = (): boolean => {
    return !!user && !!transaction && user.id === transaction.sender.id;
  };

  const isReceiver = (): boolean => {
    return !!user && !!transaction && user.id === transaction.receiver.id;
  };
  const getTargetDate = () => {
    if (
      isSender() &&
      transaction &&
      (transaction.senderFeePaidAt || transaction.receiverFeePaidAt)
    ) {
      return (
        (Number(transaction.senderFeePaidAt) + Number(transaction.arbitrationFeeTimeout)) * 1000
      );
    }

    if (
      isReceiver() &&
      transaction &&
      (transaction.senderFeePaidAt || transaction.receiverFeePaidAt)
    ) {
      return (
        (Number(transaction.senderFeePaidAt || transaction.receiverFeePaidAt) +
          Number(transaction.arbitrationFeeTimeout)) *
        1000
      );
    }
    return 0;
  };

  return (
    <>
      <DisputeStatusDetail transaction={transaction} arbitrationFee={arbitrationFee} />
      <div className={'flex flex-col'}>
        <div className={'flex flex-row'}>
          {(transaction.status === TransactionStatusEnum.WaitingReceiver ||
            transaction.status === TransactionStatusEnum.WaitingSender) && (
            <TimeOutCountDown targetDate={getTargetDate()} />
          )}
        </div>
        <DisputeButton
          user={user}
          transaction={transaction}
          arbitrationFee={arbitrationFee}
          disabled={getTargetDate() > Date.now()}
        />
        {transaction && transaction.ruling && (
          <span className='mt-4 ml-2 text-xl font-bold text-gray-600'>
            {transaction.ruling === 1 ? 'Sender Wins' : 'Receiver Wins'}
          </span>
        )}
      </div>
    </>
  );
}

export default DisputeStatusCard;

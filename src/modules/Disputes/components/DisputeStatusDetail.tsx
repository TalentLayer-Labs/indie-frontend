import { ITransaction } from '../../../types';
import { formatRateAmount } from '../../../utils/web3';

function DisputeStatusDetail({
  transaction,
  arbitrationFee,
}: {
  transaction: ITransaction;
  arbitrationFee: bigint | null;
}) {
  return (
    <div>
      <p className={'text-sm text-gray-500 mt-2'}>
        <strong>Status:</strong> {transaction?.status}
      </p>
      <p className={'text-sm text-gray-500 mt-2'}>
        <strong>Arbitration fee:</strong>{' '}
        {arbitrationFee &&
          transaction?.token &&
          formatRateAmount(
            arbitrationFee.toString(),
            transaction?.token.address,
            transaction?.token.decimals,
          ).exactValue}{' '}
        MATIC
      </p>
      <div className={'text-sm text-gray-500 mt-2'}>
        <strong>Buyer fee:</strong>{' '}
        {transaction?.senderFeePaidAt ? (
          <span className='text-green-600 font-bold'>Paid</span>
        ) : (
          <span className='text-red-600 font-bold'>Not paid</span>
        )}
      </div>
      <p className={'text-sm text-gray-500 mt-2'}>
        <strong>Seller fee:</strong>{' '}
        {transaction?.receiverFeePaidAt ? (
          <span className='text-green-600 font-bold'>Paid</span>
        ) : (
          <span className='text-red-600 font-bold'>Not paid</span>
        )}
      </p>
    </div>
  );
}

export default DisputeStatusDetail;

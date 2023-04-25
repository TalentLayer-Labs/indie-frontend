import { useState } from 'react';
import Loading from './Loading';
import { renderTokenAmount } from '../utils/conversion';
import { formatStringCompleteDate } from '../utils/dates';
import usePaymentsForUser from '../hooks/usePaymentsForUser';
import { useNetwork } from 'wagmi';

function UserIncomes({ id }: { id: string }) {
  const ROW_SIZE = 50;
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const network = useNetwork();

  const { payments, hasMoreData, loading, loadMore } = usePaymentsForUser(
    id,
    ROW_SIZE,
    startDate,
    endDate,
  );

  if (!payments || payments.length === 0) {
    return <p className='text-2xl font-medium tracking-wider mb-8'>No incomes found</p>;
  }

  const filteredPayments = payments.filter(payment => {
    const paymentTimestamp = payment.createdAt;
    const start = startDate ? new Date(startDate).getTime() / 1000 : null;
    const end = endDate ? new Date(endDate).getTime() / 1000 : null;

    if (start && end) {
      return paymentTimestamp >= start && paymentTimestamp <= end;
    } else if (start) {
      return paymentTimestamp >= start;
    } else if (end) {
      return paymentTimestamp <= end;
    } else {
      return true;
    }
  });

  return (
    <>
      <div className='pb-10'>
        <label className='font-bold' htmlFor='start'>
          Start date:{' '}
        </label>
        <input
          type='date'
          id='start'
          name='start'
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <span className='px-4'>
          <label className='font-bold' htmlFor='end'>
            End date:{' '}
          </label>
          <input
            type='date'
            id='end'
            name='end'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </span>
        <button
          type='button'
          className='ml-4 px-3 py-1 border border-gray-400 rounded text-gray-600 hover:bg-gray-200'
          onClick={() => {
            setStartDate('');
            setEndDate('');
          }}>
          Clear Dates
        </button>
      </div>

      <div className=''>
        <table className='p-4 border border-gray-200 w-full table-fixed'>
          <thead>
            <tr>
              <th className='border border-gray-200 p-2'>Amount</th>
              <th className='border border-gray-200 p-2'>Date</th>
              <th className='border border-gray-200 p-2'>Token</th>
              <th className='border border-gray-200 p-2'>Service</th>
              <th className='border border-gray-200 p-2'>Transaction information</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment, i) => {
              return (
                <tr key={i}>
                  <td className='border border-gray-200 p-2 font-bold'>
                    {renderTokenAmount(payment.rateToken, payment.amount)}
                  </td>
                  <td className='border border-gray-200 p-2 text-gray-500'>
                    {formatStringCompleteDate(payment.createdAt)}
                  </td>
                  <td className='border border-gray-200 p-2 text-gray-500'>
                    {payment.rateToken.symbol}
                  </td>
                  <td className='border border-gray-200 p-2 text-blue-500'>
                    <a target='_blank' href={`/services/${payment.service.id}`}>
                      Service n°{payment.service.id}{' '}
                    </a>
                  </td>
                  <td className='border border-gray-200 p-2 text-blue-500'>
                    {network.chain?.id === 137 ? (
                      <a
                        target='_blank'
                        href={`https://polygonscan.com/tx/${payment.transactionHash}`}>
                        Tx
                      </a>
                    ) : network.chain?.id === 80001 ? (
                      <a
                        target='_blank'
                        href={`https://mumbai.polygonscan.com/tx/${payment.transactionHash}`}>
                        Tx
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className='border border-gray-200 p-2 font-medium'>
                Total :
                <span className='font-bold pl-2'>
                  {filteredPayments
                    .reduce(
                      (total, payment) =>
                        total + parseFloat(renderTokenAmount(payment.rateToken, payment.amount)),
                      0,
                    )
                    .toFixed(3)}
                  <span className='pl-2'>MATIC</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-between mt-4'>
        {filteredPayments.length > 0 && hasMoreData && !loading && (
          <div className='flex justify-center items-center gap-10 flex-col pb-5'>
            <button
              type='submit'
              className={`px-5 py-2 mt-5 content-center border border-indigo-600 rounded-full text-indigo-600 
              hover:text-white hover:bg-indigo-700
            `}
              disabled={!hasMoreData}
              onClick={() => loadMore()}>
              Load More
            </button>
          </div>
        )}
        {loading && (
          <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default UserIncomes;

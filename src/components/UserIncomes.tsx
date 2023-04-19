import { useState } from 'react';
import { IPayment } from '../types';
import Loading from './Loading';
import { renderTokenAmount } from '../utils/conversion';
import { formatStringCompleteDate } from '../utils/dates';

function UserIncomes({ payments }: { payments: IPayment[] }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!payments || payments.length === 0) {
    return <Loading />;
  }

  const filteredPayments = payments.filter(payment => {
    const paymentTimestamp = parseInt(payment.createdAt, 10); // Convert the string to a number
    const paymentDate = new Date(paymentTimestamp * 1000); // Convert timestamp to Date object
    const start = startDate ? new Date(startDate).getTime() / 1000 : null; // Convert start date to timestamp
    const end = endDate ? new Date(endDate).getTime() / 1000 : null; // Convert end date to timestamp

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
        <label className='font-bold pl-4' htmlFor='end'>
          End date:{' '}
        </label>
        <input
          type='date'
          id='end'
          name='end'
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
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
                    {formatStringCompleteDate(parseInt(payment.createdAt))}
                  </td>
                  <td className='border border-gray-200 p-2 text-gray-500'>
                    {payment.rateToken.symbol}
                  </td>
                  <td className='border border-gray-200 p-2 text-blue-500'>
                    <a target='_blank' href={`/services/${payment.service.id}`}>
                      Service n°{payment.service.id}{' '}
                    </a>
                  </td>
                  <td className='border border-gray-200 p-2'>
                    <a
                      target='_blank'
                      href={`https://polygonscan.com/tx/${payment.transactionHash}`}>
                      Tx
                    </a>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td className='border border-gray-200 p-2 font-medium'>
                Total :
                <span className='font-bold pl-2'>
                  {filteredPayments.reduce(
                    (total, payment) =>
                      total + parseFloat(renderTokenAmount(payment.rateToken, payment.amount)),
                    0,
                  )}
                  <span className='pl-2'>MATIC</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserIncomes;

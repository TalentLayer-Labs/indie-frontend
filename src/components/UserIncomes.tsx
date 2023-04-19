import { useState } from 'react';
import { IPayment } from '../types';
import Loading from './Loading';
import { saveAs } from 'file-saver';
import { renderTokenAmount } from '../utils/conversion';
import { formatStringCompleteDate } from '../utils/dates';

function UserIncomes({ payments }: { payments: IPayment[] }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  if (!payments || payments.length === 0) {
    return <Loading />;
  }

  const filteredPayments = payments.filter(payment => {
    const paymentTimestamp = parseInt(payment.createdAt, 10);
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

  const exportToCSV = () => {
    const headers = ['Amount', 'Date', 'Token', 'Service', 'Transaction details'];

    const data = filteredPayments.map(payment => [
      renderTokenAmount(payment.rateToken, payment.amount),
      payment.createdAt,
      payment.rateToken.symbol,
      `Service n°${payment.service.id}`,
      `https://polygonscan.com/tx/${payment.transactionHash}`,
    ]);

    const csvContent = headers.join(',') + '\n' + data.map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'payments.csv');
  };

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
        <button onClick={exportToCSV} className='bg-blue-500 text-white p-2 rounded'>
          Export to CSV
        </button>
        <div className='flex items-center mt-4'>
          <label htmlFor='itemsPerPage' className='mr-2'>
            Items per page:
          </label>
          <select
            id='itemsPerPage'
            value={itemsPerPage}
            onChange={e => setItemsPerPage(parseInt(e.target.value, 10))}
            className='border border-gray-300 rounded p-3'>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
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
            {filteredPayments
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((payment, i) => {
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
                    <td className='border border-gray-200 p-2 text-blue-500'>
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
      <div className='flex justify-between mt-4'>
        <button
          className='bg-blue-500 text-white p-2 rounded'
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filteredPayments.length / itemsPerPage)}
        </span>
        <button
          className='bg-blue-500 text-white p-2 rounded'
          onClick={() =>
            setCurrentPage(
              currentPage < Math.ceil(filteredPayments.length / itemsPerPage)
                ? currentPage + 1
                : currentPage,
            )
          }
          disabled={currentPage === Math.ceil(filteredPayments.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </>
  );
}

export default UserIncomes;

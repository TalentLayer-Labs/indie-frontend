import { NavLink } from 'react-router-dom';
import usePaymentsForUser from '../hooks/usePaymentsForUser';
import { IUser } from '../types';
import { renderTokenAmount } from '../utils/conversion';

function UserPayments({ user }: { user: IUser }) {
  const payments = usePaymentsForUser(user.id);

  if (payments.length === 0) {
    return null;
  }
  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Your last incomes
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {payments.map((payment, i) => {
          return (
            <NavLink
              to={`/services/${payment.service.id}`}
              className='flex items-center p-4 bg-white rounded-xl border border-gray-200'
              key={i}>
              <div className='flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded'>
                <svg
                  className='w-6 h-6 fill-current text-green-700'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
                    clip-rule='evenodd'
                  />
                </svg>
              </div>
              <div className='flex-grow flex flex-col ml-4'>
                <span className='text-xl font-bold'>
                  {renderTokenAmount(payment.rateToken, payment.amount)}
                </span>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-500'>receive the 11/10 at 18:11</span>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </>
  );
}

export default UserPayments;

import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import Loading from '../components/Loading';
import useUserById from '../hooks/useUserById';
import usePaymentsForUser from '../hooks/usePaymentsForUser';
import UserIncomes from '../components/UserIncomes';

function Incomes() {
  const { id } = useParams<{ id: string }>();
  const user = useUserById(id || '1');
  const payments = usePaymentsForUser(id || '1');

  if (!user || !payments) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      {payments && (
        <>
          <p className='text-5xl font-medium tracking-wider mb-8'>
            Your incomes summary : <span className='text-indigo-600'>{user.handle}</span>
          </p>
          <div>
            <div className='mb-6'>
              <UserIncomes payments={payments} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Incomes;

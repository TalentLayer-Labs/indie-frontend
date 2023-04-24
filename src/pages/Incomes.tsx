import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import useUserById from '../hooks/useUserById';
import UserIncomes from '../components/UserIncomes';

function Incomes() {
  const { id } = useParams<{ id: string }>();
  const user = useUserById(id || '1');

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Your incomes summary : <span className='text-indigo-600'>{user?.handle}</span>
      </p>
      <div>
        <div className='mb-6'>
          <UserIncomes id={user?.id} />
        </div>
      </div>
    </div>
  );
}

export default Incomes;

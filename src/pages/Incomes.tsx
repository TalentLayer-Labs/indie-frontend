import { useContext } from 'react';
import Steps from '../components/Steps';
import { IUser } from '../types';
import UserIncomes from '../components/UserIncomes';
import TalentLayerContext from '../context/talentLayer';

function Incomes() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Your <span className='text-indigo-600'>incomes history</span>
      </p>

      <Steps targetTitle={'Access your dashboard'} />

      {account?.isConnected && user && (
        <div>
          <div className='mb-6'>
            <UserIncomes user={user} type='seller' />
          </div>
        </div>
      )}
    </div>
  );
}

export default Incomes;

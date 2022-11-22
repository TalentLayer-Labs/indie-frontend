import { useContext } from 'react';
import Steps from '../components/Steps';
import UserDetail from '../components/UserDetail';
import UserPayments from '../components/UserPayments';
import UserProposals from '../components/UserProposals';
import UserServices from '../components/UserServices';
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
          {/* <div className='mb-6'>
            <UserPayments user={user} />
          </div> */}
        </div>
      )}
    </div>
  );
}

export default Incomes;

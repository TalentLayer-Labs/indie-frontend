import { useContext } from 'react';
import Steps from '../../components/Steps';
import UserBadges from '../../modules/Sismo/components/UserBadges';
import UserDetail from '../../components/UserDetail';
import UserGains from '../../components/UserGains';
import UserPayments from '../../components/UserPayments';
import UserProposals from '../../components/UserProposals';
import UserServices from '../../components/UserServices';
import TalentLayerContext from '../../context/talentLayer';

function Dashboard() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      {user  == null ? (
        <p
          className='text-5xl font-medium tracking-wider mb-8'
          style={{ fontFamily: 'CustomFont' }}>
          GET{' '}
          <span className='text-red-600' style={{ fontFamily: 'CustomFont' }}>
            STARTED
          </span>
        </p>
      ) : (
        <p
          className='text-5xl font-medium tracking-wider mb-8'
          style={{ fontFamily: 'CustomFont' }}>
          YOUR{' '}
          <span className='text-red-600' style={{ fontFamily: 'CustomFont' }}>
            DASHBOARD
          </span>
        </p>
      )}
      <Steps targetTitle={'Explore'} />

      {account?.isConnected && user && (
        <div>
          <div className='mb-6'>
            <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium break-all'>
              Your profile
            </h2>
            <UserDetail user={user} />
          </div>
          <div className='mb-6'>
            <UserBadges user={user} />
          </div>
          <div className='mb-6'>
            <UserPayments user={user} />
          </div>
          <div className='mb-6'>
            <UserGains user={user} />
          </div>
          <div className='mb-6'>
            <UserServices user={user} type='buyer' />
          </div>
          <div className='mb-6'>
            <UserServices user={user} type='seller' />
          </div>
          <div className='mb-6'>
            <UserProposals user={user} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

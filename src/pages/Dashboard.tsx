import { useContext } from 'react';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';
import PlatformGains from '../components/PlatformGains';
import PlatformDetail from '../components/PlatformDetail';
import PlatformServices from '../components/PlatformServices';

function Dashboard() {
  const { account, user } = useContext(TalentLayerContext);

  if (account?.isConnected === false && account?.isConnecting === false) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Your <span className='text-indigo-600'>dashboard</span>
      </p>

      <Steps targetTitle={'Access your dashboard'} />

      {account?.isConnected && user && (
        <div>
          <div className='mb-6'>
            <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
              Your platform
            </h2>
            <PlatformDetail platformId={import.meta.env.VITE_PLATFORM_ID} />
          </div>
          <div className='mb-6'>
            <PlatformServices platformId={import.meta.env.VITE_PLATFORM_ID} />
          </div>
          <div className='mb-6'>
            <PlatformGains platformId={import.meta.env.VITE_PLATFORM_ID} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

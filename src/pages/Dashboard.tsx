import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import PlatformGains from '../components/PlatformGains';
import PlatformDetail from '../components/PlatformDetail';
import PlatformServices from '../components/PlatformServices';
import { useProvider, useSigner } from 'wagmi';
import usePlatformByAddress from '../hooks/usePlatformByAddress';
import { useAsync } from '../hooks/useAsync';
import InfoNoPlatformId from "../components/InfoNoPlatformId";

function Dashboard() {
  const { account } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const address =
    useAsync(async () => {
      return signer?.getAddress();
    }).value || undefined;
  // const platformIdOfConnectedAccount = usePlatformByAddress(address);
  const platformIdOfConnectedAccount = 1;
  if (account?.isConnected === false && account?.isConnecting === false) {
    return null;
  }
  if (platformIdOfConnectedAccount === null) {
    return <InfoNoPlatformId />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Your <span className='text-indigo-600'>dashboard</span>
      </p>

      {account?.isConnected && (
        <div>
          <div className='mb-6'>
            <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
              Your platform
            </h2>
            <PlatformDetail platformId={`${platformIdOfConnectedAccount}`} />
          </div>
          <div className='mb-6'>
            <PlatformServices platformId={`${platformIdOfConnectedAccount}`} />
          </div>
          <div className='mb-6'>
            <PlatformGains platformId={`${platformIdOfConnectedAccount}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

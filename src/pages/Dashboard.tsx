import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import PlatformGains from '../components/PlatformGains';
import PlatformDetail from '../components/PlatformDetail';
import PlatformServices from '../components/PlatformServices';
import { useProvider, useSigner } from 'wagmi';
import usePlatformIdOfConnectedAccount from '../hooks/usePlatformIdOfConnectedAccount';

function Dashboard() {
  const { account } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const platformIdOfConnectedAccount = usePlatformIdOfConnectedAccount(signer, provider);
  if (account?.isConnected === false && account?.isConnecting === false) {
    return null;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      {platformIdOfConnectedAccount === null ? (
        <>
          <p className='text-gray-500'>
            No platform ID associated with this account
            <br />
            Please request a Platform ID by emailing{' '}
            <a
              className='text-blue-500'
              href='mailto:labs@talentlayer.org?subject=Request for a Platform ID'
              target='_blank'>
              labs@talentlayer.org
            </a>
            <br />
            <br />
            Learn more about the{' '}
            <a
              className='text-blue-500'
              href='https://docs.talentlayer.org/basics/readme/platformid'
              target='_blank'>
              Layer Platform ID
            </a>
          </p>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Dashboard;

import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import InfoNoPlatformId from '../components/InfoNoPlatformId';

function ConfigurationControlCenter() {
  const { account, platform } = useContext(TalentLayerContext);
  const platformIdOfConnectedAccount = platform?.id;
  if (account?.isConnected === false && account?.isConnecting === false) {
    return null;
  }

  if (!platformIdOfConnectedAccount) {
    return <InfoNoPlatformId />;
  }

  return (
    <div className='max-w-2xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-xl font-medium tracking-wider'>
        Configuration <span className='text-zinc-600'>{'>'}</span> Control Center
      </p>
      <p className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>OnChain</p>

      {account?.isConnected && platform && (
        <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
          <p className='mt-2 pt-2 border-gray-gray-200 text-gray-900 font-medium'>
            Minting and service creation (to be added)
          </p>
        </div>
      )}
    </div>
  );
}

export default ConfigurationControlCenter;

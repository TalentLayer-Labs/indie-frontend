import { useContext } from 'react';
import PresentationForm from '../components/Form/PresentationForm';
import InfoNoPlatformId from '../components/InfoNoPlatformId';
import TalentLayerContext from '../context/talentLayer';

function Presentation() {
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
        Configuration <span className='text-zinc-600'>{'>'}</span> Presentation
      </p>
      <p className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>OffChain</p>

      {account?.isConnected && platform && <PresentationForm />}
    </div>
  );
}

export default Presentation;

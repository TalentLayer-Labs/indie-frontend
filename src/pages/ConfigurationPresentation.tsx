import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import InfoNoPlatformId from '../components/InfoNoPlatformId';
import ConfigurationPresentationForm from '../components/Form/ConfigurationPresentationForm';
import Steps from '../components/Steps';

function ConfigurationPresentation() {
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
        Configuration <span className='text-indigo-600'>{'>'}</span> Presentation
      </p>
      <p className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        OffChain
      </p>

      {account?.isConnected && platform && <ConfigurationPresentationForm />}
    </div>
  );
}

export default ConfigurationPresentation;

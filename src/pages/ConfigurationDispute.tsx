import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import InfoNoPlatformId from '../components/InfoNoPlatformId';
import SingleValueForm, { CustomValueTypes } from '../components/Form/_SingleValueForm';

function ConfigurationDispute() {
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
        Configuration <span className='text-indigo-600'>{'>'}</span> Dispute
      </p>
      <p className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>OnChain</p>

      {account?.isConnected && platform && (
        <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
          {/* TODO: uncomment when DisputeStrategy are implemented*/}
          {/*<SingleValueForm*/}
          {/*  customType={CustomValueTypes.DisputeStrategy}*/}
          {/*  valueName={'Choose your dispute strategy'}*/}
          {/*/>*/}
          <p className='mt-6 pt-4 border-t border-gray-gray-200 text-gray-900 font-medium'>
            Self Managed Configuration
          </p>
          <SingleValueForm
            customType={CustomValueTypes.ArbitrationFeeTimeout}
            valueName={'Arbitration Fee Timeout (in seconds)'}
          />
          {/* TODO: uncomment when Arbitration fees on graph are implemented*/}
          {/*<SingleValueForm*/}
          {/*  customType={CustomValueTypes.ArbitrationPrice}*/}
          {/*  valueName={'Arbitration price (in Matic)'}*/}
          {/*/>*/}
        </div>
      )}
    </div>
  );
}

export default ConfigurationDispute;

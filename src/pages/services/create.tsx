import { useContext } from 'react';
import ServiceForm from '../../components/Form/ServiceForm';
import Steps from '../../components/Steps';
import TalentLayerContext from '../../context/talentLayer';
import ConnectButton from '../../modules/Messaging/components/ConnectButton';
import MessagingContext from '../../modules/Messaging/context/messging';

function CreateService() {
  const { account, user } = useContext(TalentLayerContext);
  const { userExists } = useContext(MessagingContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Post <span className='text-indigo-600'>a job</span>
      </p>

      <Steps targetTitle={'Fill the job form'} />

      {!userExists() && account?.isConnected && user && (
        <div className='border border-gray-200 rounded-md p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a service, you need to be registered to our decentralized messaging
            service Please sign in to our messaging service to verify your identity
          </p>
          <ConnectButton />
        </div>
      )}

      {account?.isConnected && user && userExists() && <ServiceForm />}
    </div>
  );
}

export default CreateService;

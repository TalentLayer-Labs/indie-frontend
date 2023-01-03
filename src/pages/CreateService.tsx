import { useContext, useState } from 'react';
import ServiceForm from '../components/Form/ServiceForm';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';
import PushContext from '../messaging/context/pushUser';
import { ConnectButton } from '@web3modal/react';
import { IUser } from '@pushprotocol/restapi';

function CreateService() {
  const { account, user } = useContext(TalentLayerContext);
  const { getOrCreateUser } = useContext(PushContext);
  const [pushUser, setPushUser] = useState<IUser>();

  const handleGetOrCreatePushUser = async () => {
    try {
      if (getOrCreateUser && user?.address) {
        const pushUser = await getOrCreateUser(user?.address);
        setPushUser(pushUser);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Post <span className='text-indigo-600'>a job</span>
      </p>

      <Steps targetTitle={'Fill the job form'} />
      {!pushUser && account?.isConnected && user && (
        <div className='border border-gray-200 rounded-md p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a service, you need to be registered to our decentralized messaging
            service Please sign in to our messaging service to verify your identity
          </p>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => handleGetOrCreatePushUser()}>
            Connect to Push
          </button>
        </div>
      )}
      {account?.isConnected && user && pushUser && <ServiceForm />}
    </div>
  );
}

export default CreateService;

import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import ProposalForm from '../components/Form/ProposalForm';
import Loading from '../components/Loading';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';
import useServiceById from '../hooks/useServiceById';
import PushContext from '../messaging/push/context/pushUser';
import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';

function CreateProposal() {
  const { account, user } = useContext(TalentLayerContext);
  const { pushUser } = useContext(PushContext);
  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');

  const handleRegisterToPush = async () => {
    try {
      if (user?.address) {
        await createUserIfNecessary({ account: user.address });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!service) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Create <span className='text-indigo-600'>a proposal</span>
      </p>

      <Steps targetTitle={'Fill the proposal form'} />
      {!pushUser && account?.isConnected && user && (
        <div className='border border-gray-200 rounded-md p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a proposal, you need to be registered to our decentralized messaging
            service. Please sign in to our messaging service to verify your identity :
          </p>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => handleRegisterToPush()}>
            Connect to Push
          </button>
        </div>
      )}
      {account?.isConnected && user && pushUser && <ProposalForm service={service} />}
    </div>
  );
}

export default CreateProposal;

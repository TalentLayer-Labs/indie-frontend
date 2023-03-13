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
import { XmtpContext } from '../messaging/xmtp/context/XmtpContext';
import { useSigner } from 'wagmi';

function CreateProposal() {
  const { account, user } = useContext(TalentLayerContext);
  const { providerState } = useContext(XmtpContext);
  const { pushUser } = useContext(PushContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');

  const userExists = (): boolean => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
      if (pushUser) {
        return !pushUser;
      }
    } else if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
      if (providerState) {
        return providerState?.userExists;
      }
    }
    return false;
  };

  const handleRegisterToMessaging = async (): Promise<void> => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
      try {
        if (user?.address) {
          await createUserIfNecessary({ account: user.address });
        }
      } catch (e) {
        console.error('CreateProposal - Error initializing Push client :', e);
      }
    }
    if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
      try {
        if (user?.address && providerState?.initClient && signer) {
          await providerState.initClient(signer);
        }
      } catch (e) {
        console.error('CreateProposal - Error initializing XMTP client :', e);
      }
    }
  };

  if (!service) {
    return <Loading />;
  }

  const renderConnectButton = () => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') return 'Connect to XMTP';
    else if (import.meta.env.VITE_MESSENGING_TECH === 'push') return 'Connect to Push';
  };

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Create <span className='text-indigo-600'>a proposal</span>
      </p>

      <Steps targetTitle={'Filled the proposal form'} />
      {account?.isConnected && user && <ProposalForm user={user} service={service} />}
      <Steps targetTitle={'Fill the proposal form'} />
      {!userExists() && account?.isConnected && user && (
        <div className='border border-gray-200 rounded-md p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a proposal, you need to be registered to our decentralized messaging
            service. Please sign in to our messaging service to verify your identity :
          </p>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={() => handleRegisterToMessaging()}>
            {renderConnectButton()}
          </button>
        </div>
      )}
      {account?.isConnected && user && userExists() && <ProposalForm user={user} service={service} />}
    </div>
  );
}

export default CreateProposal;

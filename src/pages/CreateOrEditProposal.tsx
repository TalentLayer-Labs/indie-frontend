import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import ProposalForm from '../components/Form/ProposalForm';
import Loading from '../components/Loading';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';
import useServiceById from '../hooks/useServiceById';
import ConnectButton from '../messaging/components/ConnectButton';
import MessagingContext from '../messaging/context/messging';
import useProposalById from '../hooks/useProposalById';
import { ProposalStatusEnum, ServiceStatusEnum } from '../types';

function CreateOrEditProposal() {
  const { account, user } = useContext(TalentLayerContext);
  const { userExists } = useContext(MessagingContext);
  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');
  const existingProposal = useProposalById(`${id}-${user?.id}`);

  if (!service) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      {existingProposal &&
      existingProposal.status === ProposalStatusEnum.Pending &&
      service.status === ServiceStatusEnum.Opened ? (
        <p className='text-5xl font-medium tracking-wider mb-8'>
          Edit <span className='text-indigo-600'>your proposal</span>
        </p>
      ) : service.status !== ServiceStatusEnum.Opened ? (
        <p className='text-5xl font-medium tracking-wider mb-8'>
          This service is not <span className='text-indigo-600'>open </span> for proposals any more
        </p>
      ) : (
        <p className='text-5xl font-medium tracking-wider mb-8'>
          Create <span className='text-indigo-600'>a proposal</span>
        </p>
      )}

      <Steps targetTitle={'Filled the proposal form'} />

      {!userExists() && account?.isConnected && user && (
        <div className='border border-gray-200 rounded-md p-8'>
          <p className='text-gray-500 py-4'>
            In order to create a proposal, you need to be registered to our decentralized messaging
            service. Please sign in to our messaging service to verify your identity :
          </p>
          <ConnectButton />
        </div>
      )}

      {userExists() &&
        account?.isConnected &&
        user &&
        service.status === ServiceStatusEnum.Opened && (
          <ProposalForm user={user} service={service} existingProposal={existingProposal} />
        )}
    </div>
  );
}

export default CreateOrEditProposal;

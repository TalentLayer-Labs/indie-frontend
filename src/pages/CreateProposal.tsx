import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import ProposalForm from '../components/Form/ProposalForm';
import Loading from '../components/Loading';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';
import useServiceById from '../hooks/useServiceById';

function CreateProposal() {
  const { account, user } = useContext(TalentLayerContext);

  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');

  if (!service) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Create <span className='text-indigo-600'>a proposal</span>
      </p>

      <Steps targetTitle={'Filled the proposal form'} />
      {account?.isConnected && user && <ProposalForm user={user} service={service} />}
    </div>
  );
}

export default CreateProposal;

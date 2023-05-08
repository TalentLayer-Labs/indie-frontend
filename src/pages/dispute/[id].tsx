import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { useRouter } from 'next/router';
import Loading from '../../components/Loading';
import useProposalById from '../../hooks/useProposalById';
import DisputeForm from '../../components/Form/DisputeForm';

function Dispute() {
  const router = useRouter();
  const { id: proposalId } = router.query;
  const { account, user } = useContext(TalentLayerContext);
  const proposal = useProposalById(proposalId as string);

  if (
    user &&
    proposal &&
    user.id !== proposal?.service.buyer.id &&
    user.id !== proposal?.seller.id
  ) {
    //TODO ID wrong, need to substring before "-"
    router.push(`/services/${proposalId}`);
  }

  if (!proposal) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Raise <span className='text-indigo-600'>a dispute</span>
      </p>
      <div className={'border border-gray-200 rounded-md p-8'}>
        <div className={'mb-4 pb-4 border-b border-b-gray-200'}>
          You are about to raise a dispute for the service {proposal?.service.description?.title}
        </div>
        {account?.isConnected && user && <DisputeForm />}
      </div>
    </div>
  );
}

export default Dispute;

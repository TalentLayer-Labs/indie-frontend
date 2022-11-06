import useProposalsByUser from '../hooks/useProposalsByUser';
import { User } from '../types';
import ProposalItem from './ProposalItem';

interface IProps {
  user: User;
}

function UserProposals({ user }: IProps) {
  const proposals = useProposalsByUser(user.id);

  if (proposals.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Your pending Proposals
      </h2>
      <div className=''>
        {proposals.map((proposal, i) => {
          return <ProposalItem proposal={proposal} key={i} />;
        })}
      </div>
    </>
  );
}

export default UserProposals;

import useProposalsByUser from '../hooks/useProposalsByUser';
import { IUser } from '../types';
import UserProposalItem from './UserProposalItem';

interface IProps {
  user: IUser;
}

function UserProposals({ user }: IProps) {
  const proposals = useProposalsByUser(user.id);

  if (proposals.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium break-all'>
        Your pending Proposals
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {proposals.map((proposal, i) => {
          return <UserProposalItem proposal={proposal} key={i} />;
        })}
      </div>
    </>
  );
}

export default UserProposals;

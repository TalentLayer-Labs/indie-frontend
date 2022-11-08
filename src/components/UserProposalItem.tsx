import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import TalentLayerContext from '../context/talentLayer';
import useProposalDetails from '../hooks/useProposalDetails';
import useServiceDetails from '../hooks/useServiceDetails';
import { renderTokenAmount } from '../services/Conversion';
import { IProposal, ProposalStatusEnum } from '../types';
import { formatDate } from '../utils/dates';

function UserProposalItem({ proposal }: { proposal: IProposal }) {
  const { user } = useContext(TalentLayerContext);
  const proposalDetail = useProposalDetails(proposal.uri);
  const serviceDetail = useServiceDetails(proposal.service.uri);

  if (!proposalDetail || !serviceDetail) {
    return null;
  }

  const isBuyer = user?.id === proposal.service.buyer.id;

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start w-full  relative'>
            <img
              src={`/default-avatar-${Number(proposal.service.buyer.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{serviceDetail.title}</p>
              <p className='text-xs text-gray-500'>
                Job created by {proposal.service.buyer.handle} the{' '}
                {formatDate(Number(proposal.service.createdAt) * 1000)}
              </p>
            </div>

            <span className='absolute right-0 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800'>
              {proposal.status}
            </span>
          </div>

          <div className=' border-t border-gray-100 pt-4'>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Proposal:</strong> created by {proposal.seller.handle} the{' '}
              {formatDate(Number(proposal.createdAt) * 1000)}
            </p>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Message:</strong> {proposalDetail.description}
            </p>
          </div>
        </div>
        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-100 pt-4'>
          <p className='text-gray-900 font-bold line-clamp-1 flex-1'>
            {renderTokenAmount(serviceDetail.rateToken, serviceDetail.rateAmount)}
          </p>
          <NavLink
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            to={`/services/${proposal.service.id}`}>
            Show Job
          </NavLink>
          {isBuyer && proposal.status === ProposalStatusEnum.Pending && (
            <button className='text-green-600 bg-green-50 hover:bg-green-500 hover:text-white px-5 py-2 rounded-lg'>
              Validate proposal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProposalItem;

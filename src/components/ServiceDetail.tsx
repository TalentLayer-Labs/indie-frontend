import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import TalentLayerContext from '../context/talentLayer';
import usePaymentsByService from '../hooks/usePaymentsByService';
import useProposalsByService from '../hooks/useProposalsByService';
import useReviewsByService from '../hooks/useReviewsByService';
import useServiceDetails from '../hooks/useServiceDetails';
import { renderTokenAmount } from '../utils/conversion';
import { ConversationDisplayType, IService, ProposalStatusEnum, ServiceStatusEnum } from '../types';
import { formatDate } from '../utils/dates';
import PaymentModal from './Modal/PaymentModal';
import ReviewModal from './Modal/ReviewModal';
import ProposalItem from './ProposalItem';
import ReviewItem from './ReviewItem';
import ServiceStatus from './ServiceStatus';
import Stars from './Stars';
import PushContext from '../messaging/context/pushUser';
import { ethers } from 'ethers';

function ServiceDetail({ service }: { service: IService }) {
  const { account, user } = useContext(TalentLayerContext);
  const { initPush, pushUser } = useContext(PushContext);
  const serviceDetail = useServiceDetails(service.uri);
  const { reviews } = useReviewsByService(service.id);
  const proposals = useProposalsByService(service.id);
  const payments = usePaymentsByService(service.id);
  const navigate = useNavigate();

  if (!serviceDetail) {
    return null;
  }

  const isBuyer = user?.id === service.buyer.id;
  const isSeller = user?.id === service.seller?.id;
  const hasReviewed = !!reviews.find(review => {
    return review.to.id !== user?.id;
  });
  const userProposal = proposals.find(proposal => {
    return proposal.seller.id === user?.id;
  });

  const handleMessageUser = async () => {
    console.log('handleMessageUser', initPush);
    if (user && initPush) {
      console.log('handleMessageUser inside');
      await initPush(user.address);
      navigate(
        `/messaging/${ConversationDisplayType.CONVERSATION}/${ethers.utils.getAddress(
          service.buyer?.address,
        )}`,
      );
    }
  };

  return (
    <>
      <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
        <div className='flex flex-col items-top justify-between gap-4 w-full'>
          <div className='flex flex-col justify-start items-start gap-4'>
            <div className='flex items-center justify-start w-full relative'>
              <img
                src={`/default-avatar-${Number(service.buyer.id) % 11}.jpeg`}
                className='w-10 mr-4 rounded-full'
              />
              <div className='flex flex-col'>
                <p className='text-gray-900 font-medium'>{serviceDetail.title}</p>
                <p className='text-xs text-gray-500'>
                  created by {isBuyer ? 'You' : service.buyer.handle} the{' '}
                  {formatDate(Number(service.createdAt) * 1000)}
                </p>
              </div>
              <span className='absolute right-0 inline-flex items-center'>
                <ServiceStatus status={service.status} />
              </span>
            </div>

            <div className=' border-t border-gray-100 pt-4 w-full'>
              {service.seller && (
                <NavLink
                  className='text-sm text-gray-500 mt-4'
                  to={`/profile/${service.seller.id}`}>
                  Job handle by <span className='text-indigo-600'>{service.seller.handle}</span>
                </NavLink>
              )}
              <div className='text-sm text-gray-500 mt-4'>
                <strong>Employer rating:</strong>
                <Stars
                  rating={Number(service.buyer.rating)}
                  numReviews={service.buyer.numReviews}
                />
              </div>
              <p className='text-sm text-gray-500 mt-4'>
                <strong>About:</strong> {serviceDetail.about}
              </p>
              <p className='text-sm text-gray-500 mt-4'>
                <strong>Budget:</strong>{' '}
                {renderTokenAmount(serviceDetail.rateToken, serviceDetail.rateAmount)}
              </p>
              <p className='text-sm text-gray-500 mt-4'>
                <strong>Keywords:</strong>{' '}
                {serviceDetail.keywords.split(',').map((keyword, i) => (
                  <span
                    key={i}
                    className='inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2'>
                    {keyword}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className='flex flex-row gap-4 items-center border-t border-gray-100 pt-4'>
            {!isBuyer && service.status == ServiceStatusEnum.Opened && (
              <>
                <NavLink
                  className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
                  to={`/services/${service.id}/create-proposal`}>
                  Create proposal
                </NavLink>
                <button
                  className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
                  onClick={() => {
                    handleMessageUser();
                  }}>
                  Contact {service.buyer.handle}
                </button>
              </>
            )}
            {(isBuyer || isSeller) &&
              service.status === ServiceStatusEnum.Finished &&
              !hasReviewed && (
                <ReviewModal
                  service={service}
                  userToReview={isBuyer ? service.seller : service.buyer}
                />
              )}
            {account && service.status !== ServiceStatusEnum.Opened && (
              <PaymentModal service={service} payments={payments} isBuyer={isBuyer} />
            )}
          </div>
        </div>
      </div>

      {(isBuyer || isSeller) && reviews.length > 0 && (
        <div className='flex flex-col gap-4 mt-4'>
          <p className='text-gray-900 font-bold'>Reviews:</p>
          {reviews.map((review, index) => (
            <ReviewItem review={review} key={index} />
          ))}
        </div>
      )}

      {userProposal && (
        <div className='flex flex-col gap-4 mt-4'>
          <p className='text-gray-900 font-bold'>Your proposal:</p>
          <ProposalItem proposal={userProposal} />
        </div>
      )}

      {isBuyer && (
        <>
          {proposals.length > 0 ? (
            <>
              <p className='text-gray-900 font-bold mt-12 mb-4'>
                {service.status === ServiceStatusEnum.Opened
                  ? 'Review proposals'
                  : 'Validated proposal'}
                :
              </p>
              <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                {proposals.map((proposal, i) => {
                  return (
                    <div key={i}>
                      {(service.status === ServiceStatusEnum.Opened ||
                        proposal.status === ProposalStatusEnum.Validated) && (
                        <ProposalItem proposal={proposal} />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              className='flex p-4 text-sm text-gray-700 bg-gray-100 rounded-lg mt-4'
              role='alert'>
              <svg
                className='flex-shrink-0 inline w-5 h-5 mr-3'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'></path>
              </svg>
              <span className='sr-only'>Info</span>
              <div>
                <span className='font-medium'>There is no proposal yet</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ServiceDetail;

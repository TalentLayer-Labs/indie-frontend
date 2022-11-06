import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import TalentLayerContext from '../context/talentLayer';
import useProposalsByService from '../hooks/useProposalsByService';
import useReviewsByService from '../hooks/useReviewsByService';
import useServiceDetails from '../hooks/useServiceDetails';
import { renderTokenAmount } from '../services/Conversion';
import { Service, ServiceStatus } from '../types';
import { formatDate } from '../utils/dates';

function ServiceDetail({ service }: { service: Service }) {
  const { user } = useContext(TalentLayerContext);
  const serviceDetail = useServiceDetails(service.uri);
  const { reviews } = useReviewsByService(service.id);
  const proposals = useProposalsByService(service.id);

  if (!serviceDetail) {
    return null;
  }

  const isBuyer = user?.id === service.buyer.id;
  const isSeller = user?.id === service.seller?.id;
  const hasReviewed = !!reviews.find(review => {
    return review.to.id !== user?.id;
  });
  console.debug({ service, serviceDetail, reviews, proposals, hasReviewed });

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start w-full relative'>
            <img
              src={`/default-avatar-${Number(service.buyer.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col gap-1'>
              <p className='text-gray-900 font-medium'>{serviceDetail.title}</p>
              <p className='text-xs text-gray-500'>
                created by {isBuyer ? 'You' : service.buyer.handle} the{' '}
                {formatDate(Number(service.createdAt) * 1000)}
              </p>
            </div>
            <span className='absolute right-0 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-800'>
              {service.status}
            </span>
          </div>

          <div className=' border-t border-gray-100 pt-4 w-full'>
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

        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-100 pt-4'>
          {!isBuyer && service.status == ServiceStatus.Opened && (
            <NavLink
              className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
              to={`/services/${service.id}/create-proposal`}>
              Create proposal
            </NavLink>
          )}
          {(isBuyer || isSeller) && service.status === ServiceStatus.Finished && (
            <NavLink
              className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
              to={`/services/${service.id}/create-review`}>
              Create a review
            </NavLink>
          )}
          {isBuyer && service.status === ServiceStatus.Opened && (
            <>
              {proposals.length > 0 ? (
                <>
                  <p className='text-gray-900 font-bold'>Review proposals:</p>
                </>
              ) : (
                <>
                  <p className='text-gray-500 text-sm'>There is no proposal yet</p>
                </>
              )}
            </>
          )}
          {isSeller && (
            <>
              <p className='text-gray-900 font-bold'>Actions:</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;

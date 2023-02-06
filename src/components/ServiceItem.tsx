import { NavLink } from 'react-router-dom';
import useServiceDetails from '../hooks/useServiceDetails';
import { renderTokenAmount } from '../utils/conversion';
import { IService } from '../types';
import { formatDate } from '../utils/dates';

function ServiceItem({ service }: { service: IService }) {
  const serviceDetail = useServiceDetails(service.cid);
  if (!serviceDetail) {
    return null;
  }

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start'>
            <img
              src={`/default-avatar-${Number(service.buyer.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{serviceDetail.title}</p>
              <p className='text-xs text-gray-500'>
                created by {service.buyer.handle} the {formatDate(Number(service.createdAt) * 1000)}
              </p>
            </div>
          </div>

          <div className=' border-t border-gray-100 pt-4'>
            <div>
              {serviceDetail.keywords.split(',').map((keyword, i) => (
                <span
                  key={i}
                  className='inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2'>
                  {keyword}
                </span>
              ))}
            </div>
            <p className='text-sm text-gray-500  line-clamp-1 mt-4'>
              <strong>About:</strong> {serviceDetail.about}
            </p>
          </div>
        </div>

        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-100 pt-4'>
          <p className='text-gray-900 font-bold line-clamp-1 max-w-[100px]'>
            {renderTokenAmount(serviceDetail.rateToken, serviceDetail.rateAmount)}
          </p>
          <NavLink
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            to={`/services/${service.id}`}>
            Show details
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;

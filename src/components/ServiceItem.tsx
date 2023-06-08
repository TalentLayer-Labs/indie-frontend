import Link from 'next/link';
import { IService } from '../types';
import { renderTokenAmountFromConfig } from '../utils/conversion';
import { formatDate } from '../utils/dates';
import Image from 'next/image';

function ServiceItem({ service }: { service: IService }) {
  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start'>
            <Image
              src={`/images/default-avatar-${Number(service.buyer.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
              width={50}
              height={50}
              alt='default avatar'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium break-all'>{service.description?.title}</p>
              <p className='text-xs text-gray-500'>
                created by {service.buyer.handle} the {formatDate(Number(service.createdAt) * 1000)}
              </p>
            </div>
          </div>

          <div className=' border-t border-gray-100 pt-4'>
            <div>
              {service.description?.keywords_raw?.split(',').map((keyword, i) => (
                <span
                  key={i}
                  className='inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2'>
                  {keyword}
                </span>
              ))}
            </div>
            <p className='text-sm text-gray-500  line-clamp-1 mt-4'>
              <strong>About:</strong> {service.description?.about}
            </p>
          </div>
        </div>

        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-100 pt-4'>
          {service.token && service.description?.rateAmount && (
            <p className='text-gray-900 font-bold line-clamp-1 max-w-[100px]'>
              {renderTokenAmountFromConfig(service.token.address, service.description.rateAmount)}
            </p>
          )}
          <Link
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            href={`/services/${service.id}`}>
            Show details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;

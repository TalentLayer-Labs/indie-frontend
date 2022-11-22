import usePaymentsForUser from '../hooks/usePaymentsForUser';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import useServices from '../hooks/useServices';
import useServiceDetails from '../hooks/useServiceDetails';
import { IPayment, IService, PaymentTypeEnum, ServiceStatusEnum } from '../types';
import UserServiceItem from './UserServiceItem';
import { IUser } from '../types';

interface IProps {
  user: IUser;
  type: 'buyer' | 'seller';
}

function UserIncomes({ user, type }: IProps) {
  const services = useServices(
    undefined,
    type == 'buyer' ? user.id : undefined,
    type == 'seller' ? user.id : undefined,
  );

  if (services.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Your incomes history
      </h2>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto'>
          <p className='mt-2 text-sm text-gray-700'>A list of all your incomes.</p>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr className='divide-x divide-gray-200'>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Job n°
                    </th>
                    <th
                      scope='col'
                      className='px-4 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Job Rate
                    </th>
                    <th
                      scope='col'
                      className='px-4 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Release
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6'>
                      Release
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white'>
                  {services.map((service, index) => (
                    <tr key={index} className='divide-x divide-gray-200'>
                      <td className='whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6'>
                        {/* {services.map((service, i) => {
                          const serviceDetail = useServiceDetails(service.uri);
                          if (!serviceDetail) {
                            return null;
                          }
                          return (
                            <div key={i}>
                              <a
                                href={`/services/${service.id}`}
                                className='text-indigo-600 hover:text-indigo-900'>
                                {serviceDetail.title}
                              </a>
                            </div>
                          );
                        })} */}
                      </td>
                      <td className='whitespace-nowrap p-4 text-sm text-gray-500'>
                        <p>Release</p>
                      </td>
                      <td className='whitespace-nowrap p-4 text-sm text-gray-500'>
                        <p>Release</p>
                      </td>
                      <td className='whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6'>
                        <p>Release</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserIncomes;

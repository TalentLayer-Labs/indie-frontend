import ServiceItem from '../components/ServiceItem';
import useServices from '../hooks/useServices';
import { Service, ServiceStatus } from '../types';

function Services() {
  const services = useServices(ServiceStatus.Opened);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          All <span className='text-indigo-600'>Jobs </span>
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {services.map((service: Service, i: number) => {
            return <ServiceItem service={service} key={i} />;
          })}
        </div>

        {services.length === 20 && (
          <a
            href='#'
            className='px-5 py-2  border border-indigo-600 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-600'>
            Load More
          </a>
        )}
      </div>
    </div>
  );
}

export default Services;

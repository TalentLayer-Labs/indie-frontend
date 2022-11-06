import { useParams } from 'react-router-dom';
import ServiceDetail from '../components/ServiceDetail';
import useServiceById from '../hooks/useServiceById';

function Service() {
  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          Job <span className='text-indigo-600'>#{id}</span>
        </p>
        {service ? <ServiceDetail service={service} /> : <p>Loading...</p>}
      </div>
    </div>
  );
}

export default Service;

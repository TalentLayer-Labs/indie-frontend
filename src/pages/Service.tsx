import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ServiceDetail from '../components/ServiceDetail';
import useServiceById from '../hooks/useServiceById';

function Service() {
  const { id } = useParams<{ id: string }>();
  const service = useServiceById(id || '1');

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Job <span className='text-indigo-600'>#{id}</span>
      </p>
      {service ? <ServiceDetail service={service} /> : <Loading />}
    </div>
  );
}

export default Service;

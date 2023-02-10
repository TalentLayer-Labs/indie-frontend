import ServiceItem from '../components/ServiceItem';
import useServices from '../hooks/useServices';
import { IService, ServiceStatusEnum } from '../types';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/Form/SearchForm';
import Loading from '../components/Loading';

function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('s');
  const services = useServices({
    serviceStatus: ServiceStatusEnum.Opened,
    searchQuery: searchQuery?.toLocaleLowerCase(),
  });

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        All <span className='text-indigo-600'>Jobs </span>
      </p>
      {searchQuery && services.length > 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          Search results for <span className='text-indigo-600'>{searchQuery}</span>
        </p>
      )}
      {searchQuery && services.length === 0 && (
        <p className='text-xl font-medium tracking-wider mb-8'>
          No search results for <span className='text-indigo-600'>{searchQuery}</span>
        </p>
      )}
      {!services && <Loading />}

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchForm
          value={searchParams.get('s') || undefined}
          callback={query => {
            setSearchParams({ s: query });
          }}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {services.map((service: IService, i: number) => {
          return <ServiceItem service={service} key={i} />;
        })}
      </div>

      {services.length === 20 && (
        <a
          href='#'
          className='px-5 py-2  border border-indigo-600 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-700'>
          Load More
        </a>
      )}
    </div>
  );
}

export default Services;

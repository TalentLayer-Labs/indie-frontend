import { useRouter } from 'next/router';
import SearchServiceButton from '../../components/Form/SearchServiceButton';
import Loading from '../../components/Loading';
import ServiceItem from '../../components/ServiceItem';
import useServices from '../../hooks/useServices';
import { useContext } from 'react';
import { IService, ServiceStatusEnum } from '../../types';
import { getFilteredServicesByKeywords } from '../../components/request';
import { useEffect, useState } from 'react';
import TalentLayerContext from '../../context/talentLayer';

function Services() {
  const PAGE_SIZE = 30;
  const router = useRouter();
  const query = router.query;
  const searchQuery = query.search as string;
  const { user } = useContext(TalentLayerContext);
  const [filteredServices, setFilteredServices] = useState([]);
  const { hasMoreData, services, loading, loadMore } = useServices(
    ServiceStatusEnum.Opened,
    undefined,
    undefined,
    searchQuery?.toLocaleLowerCase(),
    PAGE_SIZE,
  );

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await getFilteredServicesByKeywords(
          undefined,
          user?.id,
          undefined,
          10,
          10,
        );
        const filteredResult = response.data.data;
        setFilteredServices(filteredResult);
      } catch (error) {
        console.error(error);
      }
    }
    fetchServices();
  }, []);

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

      <div className='flex justify-center items-center gap-10 flex-col pb-5'>
        <SearchServiceButton value={searchQuery} />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {/* We can swap services by filteredResult  */}
        {services.map((service: IService, i: number) => {
          return <ServiceItem service={service} key={i} />;
        })}
      </div>

      {services.length > 0 && hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5'>
          <button
            type='submit'
            className={`px-5 py-2 mt-5 content-center border border-indigo-600 rounded-full text-indigo-600 
              hover:text-white hover:bg-indigo-700
            `}
            disabled={!hasMoreData}
            onClick={() => loadMore()}>
            Load More
          </button>
        </div>
      )}
      {loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <Loading />
        </div>
      )}
      {!hasMoreData && !loading && (
        <div className='flex justify-center items-center gap-10 flex-col pb-5 mt-5'>
          <p>No more Services...</p>
        </div>
      )}
    </div>
  );
}

export default Services;

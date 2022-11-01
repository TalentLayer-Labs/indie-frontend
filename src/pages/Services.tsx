import Header from '../components/Header';
import ServiceItem from '../components/ServiceItem';

function Services() {
  return (
    <>
      <Header />

      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0 py-20'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <p className='text-5xl font-medium tracking-wider max-w-xs text-center'>
              All <span className='text-indigo-600'>Gigs </span>
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {[...Array(12)].map((e, i) => {
                return <ServiceItem />;
              })}
            </div>

            <a
              href='#'
              className='px-5 py-2  border border-indigo-600 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-600'>
              Load More
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Services;

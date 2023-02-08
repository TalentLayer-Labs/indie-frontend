import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchService() {
  const navigate = useNavigate();
  let searchQuery = '';

  const handleSubmit = useCallback(() => {
    const serviceUrl = searchQuery.length > 0 ? `/services?s=${searchQuery}` : '/services';
    navigate(serviceUrl);
  }, []);

  return (
    <div className='bg-gray-50'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-center items-center gap-10 flex-col py-20'>
          <p className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'>
            Find your <span className='text-indigo-600'>Next Job </span> Now
          </p>

          <p className='text-gray-500'>
            Earn money doing what you love. Find a job that fits your skills and schedule.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              className='flex divide-x bg-white py-4 px-4 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded-lg'>
              <div className='sm:px-6 flex flex-row items-center gap-2'>
                <span className='text-gray-500'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth='2'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </span>
                <input
                  className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg border-0'
                  type='text'
                  placeholder='Search by title'
                  onChange={e => (searchQuery = e.target.value)}
                />
              </div>

              <div className='sm:px-4 flex flex-row  sm:space-x-4 justify-between items-center'>
                <button
                  type='submit'
                  className='px-5 py-2 border border-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-white text-white bg-indigo-700'>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SearchService;

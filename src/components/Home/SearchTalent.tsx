import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchTalent() {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate('/services');
  }, []);

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4'>
        <div className='flex justify-center items-center gap-10 flex-col py-20'>
          <p className='text-7xl font-medium tracking-wider max-w-lg text-center'>
            Search a <span className='text-indigo-600'>Talent </span>
          </p>

          <p className='text-gray-500'>
            Hire the best freelance, verified their reviews and start working together.
          </p>

          <div>
            <div className='flex divide-x bg-white py-4 px-1 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded-full'>
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
                  className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg'
                  type='text'
                  placeholder='Search by skills'
                />
              </div>

              <div className='sm:px-4 flex flex-row  sm:space-x-4 justify-between items-center'>
                <button
                  onClick={onClick}
                  type='button'
                  className='px-5 py-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-600'>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchTalent;

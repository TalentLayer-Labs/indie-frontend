import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Search form
 * @param props {
 *  value: the initial value of the search input
 *  callback: a callback function to be called when the form is submitted
 *  destinationUrl: the url to navigate to when the form is submitted (if callback is not provided)
 * @constructor
 */
function SearchForm(props?: {
  value?: string;
  callback?: (value: string) => void;
  destinationUrl?: string;
}) {
  const [searchQuery, setSearchQuery] = useState(props!.value || '');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (props?.callback) {
      props?.callback ? props.callback(searchQuery) : null;
    } else if (props?.destinationUrl) {
      navigate(props.destinationUrl + `?s=${searchQuery}`);
    }
    return;
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
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
            placeholder='Search by skills'
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
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
  );
}

export default SearchForm;

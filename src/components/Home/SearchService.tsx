import SearchServiceButton from '../Form/SearchServiceButton';
import { activateCron } from '../request';

function SearchService() {
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
          <SearchServiceButton value={''} />
          <button onClick={() => activateCron()}>Activate Cron</button>
        </div>
      </div>
    </div>
  );
}

export default SearchService;

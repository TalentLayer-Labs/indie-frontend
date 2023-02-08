import CreateId from '../components/Home/CreateId';
import SearchTalentButton from '../components/Form/SearchTalentButton';
import SearchServiceButton from '../components/Form/SearchServiceButton';

function Home() {
  return (
    <>
      <CreateId />
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
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-900 px-4'>
          <div className='flex justify-center items-center gap-10 flex-col py-20'>
            <p className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'>
              Search a <span className='text-indigo-600'>Talent </span>
            </p>
            <p className='text-gray-500'>
              Hire the best freelance, verified their reviews and start working together.
            </p>
            <SearchTalentButton value={''} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

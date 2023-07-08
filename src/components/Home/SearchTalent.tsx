import SearchTalentButton from '../Form/SearchTalentButton';

function SearchTalent() {
  return (
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
  );
}

export default SearchTalent;

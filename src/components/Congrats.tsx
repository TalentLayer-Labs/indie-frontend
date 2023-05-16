function Congrats() {
  return (
    <div className='max-w-7xl mx-auto text-center text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Congratulations{' '}
        <span className='bg-clip-text text-transparent bg-gradient-to-r from-il-green-700 to-il-green-600'>
          Nouns DAO
        </span>
        !
      </p>
      <p className='text-2xl font-medium tracking-wider mb-8'>
        You've succesfully created your organization.{' '}
      </p>
      <div className='flex flex-row justify-center items-center w-full p-4'>
        <img
          alt='raccoon'
          className='h-96 items-center flex-shrink-0 mr-4'
          src='/images/raccoon.gif'></img>
      </div>
      <br></br>
      <p className='text-md font-medium tracking-wider mb-8'>
        Organizations help your team manage relationships with influencers in a collaborative way.
      </p>
    </div>
  );
}

export default Congrats;

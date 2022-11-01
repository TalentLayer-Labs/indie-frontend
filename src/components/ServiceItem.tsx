function ServiceItem() {
  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-8'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start'>
            <img src='/logo192.png' className='w-6 m-4' />
            <div className='flex flex-col gap-1'>
              <p className='text-gray-900 font-medium'>Filecoin</p>
              <p className='text-xs text-gray-500'>Remote or Lisbon</p>
            </div>
          </div>

          <div>
            <p className='text-lg font-bold text-gray-900'>Web3 dapp</p>
          </div>
          <div>
            <p className='text-gray-500 font-medium'>1 week</p>
          </div>
          <div>
            <p className='text-gray-500'>I'm an expert on integrating web3 dapps with reactJS</p>
          </div>
        </div>

        <div className='flex flex-row gap-4 justify-between items-center'>
          <p className='text-gray-900 font-bold'>$6700</p>
          <a
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            href='#'>
            Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default ServiceItem;

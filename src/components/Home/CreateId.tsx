import { useAccount, useConnectModal } from '@web3modal/react';
import { useCallback } from 'react';

function CreateId() {
  const { account } = useAccount();
  const { open } = useConnectModal();

  const onCreate = useCallback(() => {
    if (account.isConnected) {
      console.log('create');
    } else {
      open();
    }
  }, [account.isConnected]);

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0 py-20'>
        <div className='flex flex-col items-center justify-center gap-10'>
          <p className='text-7xl font-medium tracking-wider max-w-lg text-center'>
            Create <span className='text-indigo-600'>Your </span> TalentLayer ID
          </p>

          <p className='text-gray-500'>Own your reputation and identity on the decentralized web</p>

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
                      d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                    />
                  </svg>
                </span>
                <input
                  className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg'
                  type='text'
                  placeholder='Choose your handle'
                />
              </div>

              <div className='sm:px-4 flex flex-row  sm:space-x-4 justify-between items-center'>
                <button
                  type='button'
                  onClick={onCreate}
                  className='px-5 py-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-600'>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateId;

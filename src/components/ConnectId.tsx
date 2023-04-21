import { ConnectButton } from '@web3modal/react';
import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';

function ConnectId() {
  const { account } = useContext(TalentLayerContext);

  if (account?.isConnected) {
    return null;
  }

  return (
    <>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0 py-20'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <p className='text-5xl sm:text-7xl font-medium tracking-wider max-w-lg text-center'>
              Connect using <span className='text-indigo-600'>your</span> platform ID
            </p>

            <p className='text-gray-500 text-center'>
              Administrate your plateform,
              <br />
              manage your platform fees and much more
            </p>

            <ConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}

export default ConnectId;

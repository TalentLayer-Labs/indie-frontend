import { ConnectButton } from '@web3modal/react';

function ConnectBlock() {
  return (
    <div className='border border-gray-200 rounded-md p-8' style={{ fontFamily: 'CustomFont' }}>
      <p className='text-gray-400 py-4'>
        In order to create your profile, post a job, access messaging... you need first to connect
        your wallet
      </p>
      <ConnectButton />
    </div>
  );
}

export default ConnectBlock;

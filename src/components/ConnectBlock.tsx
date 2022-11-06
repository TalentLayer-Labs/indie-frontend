import { ConnectButton } from '@web3modal/react';

function ConnectBlock() {
  return (
    <div className='py-8'>
      <p className='text-gray-500 py-4'>
        In order to post a job, you need first to connect your wallet
      </p>
      <ConnectButton />
    </div>
  );
}

export default ConnectBlock;

import { ConnectButton, useAccount } from '@web3modal/react';
import ServiceForm from '../components/Form/ServiceForm';
import TalentLayerIdForm from '../components/Form/TalentLayerIdForm';
import useUser from '../hooks/useUser';

function CreateService() {
  const { account } = useAccount();
  const user = useUser();

  console.log(user);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          Post <span className='text-indigo-600'>a job</span>
        </p>
      </div>

      {account.isConnected === false && <ConnectButton />}
      {account.isConnected === true && user === undefined && <TalentLayerIdForm />}
      {account.isConnected === true && user !== undefined && <ServiceForm />}
    </div>
  );
}

export default CreateService;

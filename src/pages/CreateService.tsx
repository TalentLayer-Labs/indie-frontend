import { useContext } from 'react';
import ConnectBlock from '../components/ConnectBlock';
import ServiceForm from '../components/Form/ServiceForm';
import TalentLayerIdForm from '../components/Form/TalentLayerIdForm';
import TalentLayerContext from '../context/talentLayer';

function CreateService() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          Post <span className='text-indigo-600'>a job</span>
        </p>
      </div>

      {(account?.isConnected == undefined || account?.isConnected === false) && <ConnectBlock />}
      {account && account.isConnected === true && user === undefined && <TalentLayerIdForm />}
      {account && account.isConnected === true && user !== undefined && <ServiceForm />}
    </div>
  );
}

export default CreateService;

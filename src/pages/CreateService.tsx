import { useContext } from 'react';
import ServiceForm from '../components/Form/ServiceForm';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';

function CreateService() {
  const { account, user } = useContext(TalentLayerContext);

  console.log({ account, user });

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Post <span className='text-indigo-600'>a job</span>
      </p>

      <Steps targetTitle={'Filled the job form'} />
      {account?.isConnected && user && <ServiceForm />}
    </div>
  );
}

export default CreateService;

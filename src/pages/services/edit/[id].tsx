import { useContext } from 'react';
import Steps from '../../../components/Steps';
import ServiceForm from '../../../components/Form/ServiceForm';
import TalentLayerContext from '../../../context/talentLayer';
import { useRouter } from 'next/router';

function EditWService() {
  const { account, user } = useContext(TalentLayerContext);
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Edit your <span className='text-indigo-600'>Service</span>
      </p>

      <Steps targetTitle={'Edit your profile'} />

      {account?.isConnected && user && <ServiceForm serviceId={id as string} />}
    </div>
  );
}

export default EditWService;

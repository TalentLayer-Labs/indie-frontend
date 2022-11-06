import { useContext } from 'react';
import Steps from '../components/Steps';
import TalentLayerContext from '../context/talentLayer';

function CreateReview() {
  const { account, user } = useContext(TalentLayerContext);

  console.log({ account, user });

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Create <span className='text-indigo-600'>a review</span>
      </p>

      <Steps targetTitle={'Filled the review form'} />
      {/* {account?.isConnected && user && <ServiceForm />} */}
    </div>
  );
}

export default CreateReview;

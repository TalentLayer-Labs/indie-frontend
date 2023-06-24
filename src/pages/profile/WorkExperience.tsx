import { useContext } from 'react';
import WorkExperienceForm from '../../components/Form/WorkExperienceForm';
import Steps from '../../components/Steps';
import TalentLayerContext from '../../context/talentLayer';

function AddWorkExperience() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Add your <span className='text-indigo-600'>Work Experience</span>
      </p>

      <Steps targetTitle={'Add your work experience'} />

      {account?.isConnected && user && <WorkExperienceForm />}
    </div>
  );
}

export default AddWorkExperience;

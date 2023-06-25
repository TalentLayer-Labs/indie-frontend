import { useContext } from 'react';
import ProjectContributionForm from '../../components/Form/ProjectContributionsForm';
import Steps from '../../components/Steps';
import TalentLayerContext from '../../context/talentLayer';

function AddProjectContributions() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Add your <span className='text-indigo-600'>Project Contributions</span>
      </p>

      <Steps targetTitle={'Add your project contributions'} />

      {account?.isConnected && user && <ProjectContributionForm />}
    </div>
  );
}

export default AddProjectContributions;

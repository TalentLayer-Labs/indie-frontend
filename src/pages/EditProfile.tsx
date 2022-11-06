import { useContext } from 'react';
import ConnectBlock from '../components/ConnectBlock';
import ProfileForm from '../components/Form/ProfileForm';
import TalentLayerIdForm from '../components/Form/TalentLayerIdForm';
import TalentLayerContext from '../context/talentLayer';

function EditProfile() {
  const { account, user } = useContext(TalentLayerContext);

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <div className='flex flex-col gap-10'>
        <p className='text-5xl font-medium tracking-wider'>
          Edit your <span className='text-indigo-600'>Profile</span>
        </p>
      </div>

      {(account?.isConnected == undefined || account?.isConnected === false) && <ConnectBlock />}
      {account && account.isConnected === true && user === undefined && <TalentLayerIdForm />}
      {account && account.isConnected === true && user !== undefined && <ProfileForm />}
    </div>
  );
}

export default EditProfile;

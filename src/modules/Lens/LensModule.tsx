import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import useUserById from '../../hooks/useUserById';
import UserLensProfile from '../../modules/Lens/components/UserLensProfile';
import UserLensFeed from '../../modules/Lens/components/UserLensFeed';
import useLensUser from './hooks/useLensUsers';

function Profile() {
  const { id } = useParams<{ id: string }>();
  const user = useUserById(id || '1');

  return (
    <div>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Lens Profile
      </h2>
      <div className='flex'>
        <>
          <div className='md:w-1/3 mb-6'>
            <UserLensProfile user={user} />
          </div>
          <div className='md:w-2/3 mb-6'>
            <UserLensFeed user={user} />
          </div>
        </>
      </div>
    </div>
  );
}

export default Profile;

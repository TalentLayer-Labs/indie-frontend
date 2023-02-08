import { useParams } from 'react-router-dom';
import Back from '../components/Back';
import Loading from '../components/Loading';
import UserDetail from '../components/UserDetail';
import UserServices from '../components/UserServices';
import useUserById from '../hooks/useUserById';
import LensModule from '../modules/Lens/LensModule';
import PohModule from '../modules/Poh/pohModule';

function Profile() {
  const { id } = useParams<{ id: string }>();
  const user = useUserById(id || '1');

  if (!user) {
    return <Loading />;
  }

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <Back />
      {user && (
        <>
          <p className='text-5xl font-medium tracking-wider mb-8'>
            Profile <span className='text-indigo-600'>{user.handle}</span>
          </p>
          <div>
            <div className='mb-6'>
              <UserDetail user={user} />
            </div>
            <div className='mb-6'>
              <UserServices user={user} type='buyer' />
            </div>
            <div className='mb-6'>
              <UserServices user={user} type='seller' />
            </div>
            <div className='mb-6'>
              <LensModule address={user.address} />
            </div>
            <div className='mb-6'>
              <PohModule address={user.address} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;

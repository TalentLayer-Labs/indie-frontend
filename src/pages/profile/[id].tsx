import { useRouter } from 'next/router';
import Back from '../../components/Back';
import Loading from '../../components/Loading';
import UserDetail from '../../components/UserDetail';
import UserServices from '../../components/UserServices';
import useUserById from '../../hooks/useUserById';
import LensModule from '../../modules/Lens/LensModule';
import UserBadges from '../../modules/Sismo/components/UserBadges';

function Profile() {
  const router = useRouter();
  const { id } = router.query;
  const user = useUserById(id as string);

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
              <UserBadges user={user} />
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
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;

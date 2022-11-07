import useUserDetails from '../hooks/useUserDetails';
import { User } from '../types';
import Loading from './Loading';
import Stars from './Stars';

function UserDetail({ user }: { user: User }) {
  const userDetails = useUserDetails(user?.uri);

  if (!user) {
    return <Loading />;
  }

  console.log(userDetails);

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start mb-4'>
            <img
              src={`/default-avatar-${Number(user?.id !== undefined ? user.id : '1') % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col gap-1'>
              <p className='text-gray-900 font-medium'>{userDetails?.title || '-'}</p>
            </div>
          </div>
        </div>
        <Stars rating={Number(user.rating)} numReviews={user.numReviews} />
      </div>
    </div>
  );
}

export default UserDetail;

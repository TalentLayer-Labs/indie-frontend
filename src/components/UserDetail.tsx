import useUserDetails from '../hooks/useUserDetails';
import { User } from '../types';
import Loading from './Loading';
import Stars from './Stars';

function UserDetail({ user }: { user: User }) {
  const userDetails = useUserDetails(user?.uri);

  if (user.uri && !userDetails) {
    return <Loading />;
  }

  console.log(userDetails);

  return (
    <div className='flex flex-col rounded-xl p-4 border border-gray-200'>
      <div className='flex items-top justify-between w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start mb-4'>
            <img
              src={`/default-avatar-${Number(user?.id !== undefined ? user.id : '1') % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{userDetails?.title || '-'}</p>
            </div>
          </div>
        </div>
        <Stars rating={Number(user.rating)} numReviews={user.numReviews} />
      </div>
      <div className=' border-t border-gray-100 pt-4 w-full'>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>Skills:</strong> {userDetails?.skills}
        </p>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>About:</strong> {userDetails?.about}
        </p>
      </div>
    </div>
  );
}

export default UserDetail;

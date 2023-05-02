import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import useUserById from '../hooks/useUserById';
import { IUser } from '../types';
import Loading from './Loading';
import Stars from './Stars';

function UserItem({ user }: { user: IUser }) {
  const { user: currentUser } = useContext(TalentLayerContext);
  const userDescription = user?.id ? useUserById(user?.id)?.description : null;

  if (!user?.id) {
    return <Loading />;
  }

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start mb-4'>
            <Image
              src={`/images/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
              alt='default avatar'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{user.handle}</p>
              <p className='text-xs text-gray-500'>{userDescription?.title || '-'}</p>
            </div>
          </div>
        </div>
        <Stars rating={Number(user.rating)} numReviews={user.userStats.numReceivedReviews} />

        <div className='flex flex-row gap-4 justify-end items-center'>
          <Link
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            href={`/profile/${user.id}`}>
            View profile
          </Link>
          {currentUser?.id === user.id && (
            <Link
              className='text-green-600 bg-green-50 hover:bg-green-500 hover:text-white px-5 py-2 rounded-lg'
              href={`/profile/edit`}>
              Edit profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserItem;

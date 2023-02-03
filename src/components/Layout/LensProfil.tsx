import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import useUserDetails from '../../hooks/useUserDetails';
import useUserById from '../../hooks/useUserById';
import { IUser } from '../../types';
import Loading from '../Loading';

import useLensUser from '../../hooks/useLensUsers';
import { log } from 'console';

function LensProfile({ user }: { user: IUser }) {
  const { user: currentUser } = useContext(TalentLayerContext);
  let currentUserAddress = currentUser?.address.toString() || '';
  const userById = useUserById(user?.id);

  console.log('Addresse', user.address);

  const { lensUser } = useLensUser(currentUserAddress);
  console.log('lensUser', lensUser?.id);

  return (
    <>
      {lensUser?.id == undefined && (
        <div>
          <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
            Lens Profile
          </h2>

          <div className='flex '>
            <div className='card bg-white shadow-xl hover:shadow border border-gray-200 rounded-xl'>
              <img
                className='w-32 mx-auto rounded-full border-8 border-white'
                src='https://avatars.githubusercontent.com/u/67946056?v=4'
                alt=''></img>
              <div className='text-center text-gray-900 font-medium'>{lensUser?.name}</div>
              <div className='text-center mt-2 font-light text-sm'>id : {lensUser?.id}</div>
              <span id='lens-follow-small' data-handle={'nader.lens'} />
              <div className='px-6 text-center mt-2 font-light text-sm'>
                <p>Front end Developer, avid reader. Love to take a long walk, swim</p>
              </div>
              <div className='flex p-4'>
                <div className='w-1/2 text-center'>
                  <span className='font-bold'>1.8 k</span> Followers
                </div>
                <div className='w-0 border border-gray-300'></div>
                <div className='w-1/2 text-center'>
                  <span className='font-bold'>2.0 k</span> Following
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default LensProfile;

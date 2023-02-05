import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import useUserById from '../../hooks/useUserById';
import { IUser } from '../../types';
import useLensUser from '../../hooks/useLensUsers';
import { readableIpfsUrl } from '../../utils/ipfs';

function LensProfile({ user }: { user: IUser }) {
  const { user: currentUser } = useContext(TalentLayerContext);
  let currentUserAddress = currentUser?.address.toString() || '';
  const userById = useUserById(user?.id);

  // we get Lens user details
  const { lensUser } = useLensUser(currentUserAddress);

  // Lens profile picture ipfs format
  let lensProfileipfs = lensUser?.picture.original.url;
  const lensUserProfilPics = readableIpfsUrl(lensProfileipfs);

  return (
    <>
      {lensUser?.id && (
        <div>
          <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
            Lens Profile
          </h2>

          <div className='flex '>
            <div className='card bg-white shadow-xl hover:shadow border border-gray-200 rounded-xl'>
              <img
                className='w-32 mx-auto rounded-full border-8 border-white'
                src={lensUserProfilPics}
                alt=''></img>
              <div className='text-center text-gray-900 font-medium'>{lensUser?.name}</div>
              <div className='text-center mt-2 font-light text-sm'>id : {lensUser?.id}</div>
              <span id='lens-follow-small' data-handle={'nader.lens'} />
              <div className='px-6 text-center mt-2 font-light text-sm'>
                <p>{lensUser?.bio}</p>
              </div>
              <div className='flex p-4'>
                <div className='w-1/2 text-center'>
                  <span className='font-bold'>{lensUser?.stats.totalFollowers}</span> Followers
                </div>
                <div className='w-0 border border-gray-300'></div>
                <div className='w-1/2 text-center'>
                  <span className='font-bold'>{lensUser?.stats.totalFollowing}</span> Following
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

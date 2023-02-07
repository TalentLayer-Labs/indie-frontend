import Loading from '../../../components/Loading';
import { readableIpfsUrl } from '../../../utils/ipfs';
import useLensUser from '../hooks/useLensUsers';
interface IProps {
  address: `0x${string}`;
}

function UserLensProfile({ address }: IProps) {
  // we get Lens user details
  const { lensUser } = useLensUser(address);

  if (!lensUser?.id) {
    return <Loading />;
  }

  // Lens profile picture ipfs format
  const lensProfileipfs = lensUser?.picture.original.url;
  const lensUserProfilPics = readableIpfsUrl(lensProfileipfs);

  return (
    <>
      {lensUser?.id && (
        <div>
          <div className='flex '>
            <div className='card bg-white shadow-xl hover:shadow border border-gray-200 rounded-xl'>
              <img
                className='w-32 pt-2  mx-auto rounded-full border-8 border-white'
                src={lensUserProfilPics}
                alt=''></img>
              <div className='text-center text-gray-900 text-lg font-medium'>{lensUser?.name}</div>
              <div className='text-center mt-2 text-green-500 font-medium text-base'>
                id : {lensUser?.id}
              </div>
              <span id='lens-follow-small' data-handle={'nader.lens'} />
              <div className='px-2 text-center mt-2 font-light text-sm'>
                <p>
                  <strong>{lensUser?.bio} </strong>
                </p>
              </div>
              <div className='p-4 text-center'>
                <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 border border-green-700 rounded'>
                  Follow me
                </button>
              </div>
              <div className='flex p-2'>
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
export default UserLensProfile;

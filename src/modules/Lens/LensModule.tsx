import UserLensFeed from '../../modules/Lens/components/UserLensFeed';
import UserLensProfile from '../../modules/Lens/components/UserLensProfile';
import useLensUser from './hooks/useLensUsers';

interface IProps {
  address: string;
}

function LensModule({ address }: IProps) {
  const { lensUser } = useLensUser(address);

  if (!lensUser?.id) {
    return null;
  }

  return (
    <div>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium break-all'>
        Lens Profile
      </h2>
      <div className='flex'>
        <>
          <div className='md:w-1/2 xl:w-1/3 mb-6'>
            <UserLensProfile lensUser={lensUser} />
          </div>
          <div className='md:w-2/3 mb-6'>
            <UserLensFeed lensUser={lensUser} />
          </div>
        </>
      </div>
    </div>
  );
}

export default LensModule;

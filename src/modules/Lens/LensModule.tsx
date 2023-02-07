import UserLensFeed from '../../modules/Lens/components/UserLensFeed';
import UserLensProfile from '../../modules/Lens/components/UserLensProfile';

interface IProps {
  address: `0x${string}`;
}

function LensModule({ address }: IProps) {
  return (
    <div>
      <h2 className='mb-6 pb-4 border-b border-gray-gray-200 text-gray-900 font-medium'>
        Lens Profile
      </h2>
      <div className='flex'>
        <>
          <div className='md:w-1/3 mb-6'>
            <UserLensProfile address={address} />
          </div>
          <div className='md:w-2/3 mb-6'>
            <UserLensFeed address={address} />
          </div>
        </>
      </div>
    </div>
  );
}

export default LensModule;

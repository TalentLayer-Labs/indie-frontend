import Loading from '../../../components/Loading';
import { formatStringDate } from '../../../utils/dates';
import { readableIpfsUrl } from '../../../utils/ipfs';
import useLensFeed from '../hooks/useLensFeed';
import useLensUser from '../hooks/useLensUsers';

interface IProps {
  address: `0x${string}`;
}

function UserLensFeed({ address }: IProps) {
  // we get Lens user details
  const { lensUser } = useLensUser(address);

  // we get Lens user details
  const { lensFeed } = useLensFeed(lensUser?.id);
  console.log('lensFeed', lensFeed);

  if (!lensUser?.id) {
    return <Loading />;
  }

  // We format the Lens post Date
  const readableDate = formatStringDate(lensFeed?.createdAt || '');

  return (
    <>
      {lensFeed?.metadata && (
        <div className='flex card bg-white shadow-xl hover:shadow border border-gray-200 rounded-xl ml-5'>
          <div>
            {lensFeed.items.map(
              (item: any, index: any) => (
                console.log('item', item),
                (
                  <div key={index}>
                    <p>Name: {item.name}</p>
                  </div>
                )
              ),
            )}
          </div>

          {lensFeed?.metadata.media.original && (
            <div>
              <img
                className='w-32 mx-auto rounded-full border-8 border-white'
                src={readableIpfsUrl(lensFeed?.metadata.media.original.url)}
                alt=''></img>
            </div>
          )}

          <div className='p-5'>
            <div className='text-gray-900 font-medium'>{lensFeed?.metadata.name}</div>
            <div className=' mt-2 font-light text-sm'>{lensFeed?.metadata.description}</div>
            <div className='mt-2 font-light text-sm'>
              <p>
                <span className='font-medium'>Post date :</span> {readableDate}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default UserLensFeed;

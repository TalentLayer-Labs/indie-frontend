import { formatStringDate } from '../../../utils/dates';
import useLensFeed from '../hooks/useLensFeed';
import { buildMediaUrl } from '../utils/ipfs';
import { ILensPublication, IlensUser } from '../utils/types';

interface IProps {
  lensUser: IlensUser;
}

function UserLensFeed({ lensUser }: IProps) {
  const { lensFeed } = useLensFeed(lensUser.id);
  console.log('lensFeed', lensFeed);

  if (!lensFeed) {
    return null;
  }

  return (
    <>
      {lensFeed.map((item: ILensPublication, index: number) => (
        <div
          key={index}
          className={`rounded-xl flex card bg-white shadow-md hover:shadow border border-gray-200 ml-5 ${
            index !== 0 ? 'mt-4' : ''
          }`}>
          {item.metadata.media[0] && (
            <div>
              <img
                className='w-40 mx-auto '
                src={buildMediaUrl(item.metadata.media[0].original.url)}
                alt=''></img>
            </div>
          )}

          <div className='p-5'>
            <div className='text-gray-900 font-medium'>{item.metadata.name}</div>
            <div className='mt-2 font-light text-sm'>{item.metadata.content}</div>
            <div className='mt-2 font-light text-sm'>
              <p>
                <span className='font-medium'>Post date :</span>{' '}
                {formatStringDate(item.createdAt || '')}
              </p>
              <div className='mt-2'>
                <a
                  target='_blank'
                  className='font-medium text-blue-400 '
                  href={`https://lenster.xyz/posts/${item.id}`}>
                  Read it on lenster
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className='p-4'>
        <a
          href={`https://lenster.xyz/u/${lensUser.handle}`}
          target='_blank'
          className='text-black font-bold hover:text-green-500 '>
          More posts....
        </a>
      </div>
    </>
  );
}
export default UserLensFeed;

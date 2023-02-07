import { formatStringDate } from '../../../utils/dates';
import useLensFeed from '../hooks/useLensFeed';
import { buildMediaUrl } from '../utils/ipfs';
import { ILensPublication, IlensUser } from '../utils/types';

interface IProps {
  lensUser: IlensUser;
}

function UserLensFeed({ lensUser }: IProps) {
  const { lensFeed } = useLensFeed(lensUser.id);

  if (!lensFeed) {
    return null;
  }

  return (
    <>
      {lensFeed.map((item: ILensPublication, index: number) => (
        <div
          key={index}
          className='flex card bg-white shadow-xl hover:shadow border border-gray-200 ml-5'>
          {item.metadata.media[0] && (
            <div>
              <img
                className='w-32 mx-auto '
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
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default UserLensFeed;

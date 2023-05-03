import Image from 'next/image';
import useLensFeed from '../hooks/useLensFeed';
import { timeSince } from '../utils/date';
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
        <a key={index} href={`https://lenster.xyz/posts/${item.id}`} target='_blank' className=''>
          <div
            className={`card bg-white border border-gray-200 rounded-xl ml-4 ${
              index !== 0 ? 'mt-4' : ''
            }`}>
            <div className='flex'>
              {item.metadata.media[0] && (
                <div className='w-36'>
                  <Image
                    width={200}
                    height={200}
                    className='mx-auto rounded-xl'
                    src={buildMediaUrl(item.metadata.media[0].original.url)}
                    alt=''
                  />
                </div>
              )}

              <div className='w-full p-5 flex flex-col justify-between'>
                <p className='font-light text-xs text-gray-600'>
                  Created {timeSince(item.createdAt || '')} ago
                </p>
                <div className='mt-2 text-sm line-clamp-2'>{item.metadata.content}</div>
                <div className='mt-2'>
                  <div className='flex space-x-2 text-xs'>
                    <div className='flex space-x-1 items-center'>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-gray-600 cursor-pointer'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                          />
                        </svg>
                      </span>
                      <span>{item.stats.totalAmountOfComments}</span>
                    </div>
                    <div className='flex space-x-1 items-center'>
                      <span>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer'
                          viewBox='0 0 20 20'
                          fill='currentColor'>
                          <path
                            fillRule='evenodd'
                            d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                      <span>{item.stats.totalUpvotes}</span>
                    </div>
                    <span className='font-medium text-blue-400 w-full text-right'>
                      Read it on Lenster
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      ))}
      <div className='flex pt-4 justify-end align-end'>
        <a
          href={`https://lenster.xyz/u/${lensUser.handle}`}
          target='_blank'
          className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg active'>
          More posts
        </a>
      </div>
    </>
  );
}
export default UserLensFeed;

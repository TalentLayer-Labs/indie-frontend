import { IPohUser } from '../utils/types';

interface IProps {
  pohUser: IPohUser;
}

function UserPohProfile({ pohUser }: IProps) {
  return (
    <>
      {pohUser?.registered && (
        <div>
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
        </div>
      )}
    </>
  );
}
export default UserPohProfile;

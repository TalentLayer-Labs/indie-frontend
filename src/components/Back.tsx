import { useRouter } from 'next/router';

function Back() {
  const router = useRouter();

  return (
    <nav className='flex' aria-label='Back'>
      <ol className='inline-flex items-center space-x-1 md:space-x-3'>
        <li className=''>
          <a
            href='#'
            onClick={() => router.back()}
            className='text-sm font-medium text-gray-700 hover:text-gray-900 inline-flex items-center'>
            <svg
              className='w-2 h-2 text-gray-400 mr-1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'>
              <path d='M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z' />
            </svg>
            Back
          </a>
        </li>
      </ol>
    </nav>
  );
}

export default Back;

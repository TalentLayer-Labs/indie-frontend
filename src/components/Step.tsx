function Step({
  status,
  title,
  order,
  isLast,
}: {
  status: string;
  title: string;
  order: number;
  isLast?: boolean;
}) {
  return (
    <li className='relative md:flex md:flex-1'>
      <div className='group flex w-full items-center'>
        <span className='flex items-center px-6 py-4 text-sm font-medium'>
          {status === 'done' && (
            <>
              <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-700 group-hover:bg-indigo-800'>
                <svg
                  className='h-6 w-6 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              <span className='ml-4 text-sm font-medium text-gray-900'>{title}</span>
            </>
          )}
          {status === 'inprogress' && (
            <span className='flex items-center animate-pulse'>
              <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600'>
                <span className='text-indigo-600'>0{order}</span>
              </span>
              <span className='ml-4 text-sm font-medium text-indigo-600'>{title}</span>
            </span>
          )}
          {status === 'todo' && (
            <>
              <span className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-200 group-hover:border-gray-400'>
                <span className='text-gray-500 group-hover:text-gray-900'>0{order}</span>
              </span>
              <span className='ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900'>
                {title}
              </span>
            </>
          )}
        </span>
      </div>

      {!isLast && (
        <div className='absolute top-0 right-0 hidden h-full w-5 md:block' aria-hidden='true'>
          <svg
            className='h-full w-full text-gray-200'
            viewBox='0 0 22 80'
            fill='none'
            preserveAspectRatio='none'>
            <path
              d='M0 -2L20 40L0 82'
              vectorEffect='non-scaling-stroke'
              stroke='currentcolor'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      )}
    </li>
  );
}

export default Step;

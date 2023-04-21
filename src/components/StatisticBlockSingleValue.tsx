import React from 'react';

function StatisticBlockSingleValue({
  value,
  label,
  isGrowing,
  hideArrow,
}: {
  value: string;
  label?: string;
  isGrowing?: boolean;
  hideArrow?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className='p-4 bg-white rounded-xl border border-gray-200'>
      <div className='flex items-center'>
        {!hideArrow && (
          <div
            className={`
                flex flex-shrink-0 items-center justify-center 
                ${isGrowing ? 'bg-green-200' : 'bg-red-200'} h-16 w-16 rounded
              `}>
            <svg
              className={`-6 h-6 fill-current ${isGrowing ? 'text-green-700' : 'text-red-700'}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}
        <div className='flex-grow flex flex-col ml-4'>
          <span className='text-xl font-bold'>{value}</span>
        </div>
      </div>
      <h3 className='text-base font-normal text-gray-500 mt-2'>{label}</h3>
    </div>
  );
}

export default StatisticBlockSingleValue;

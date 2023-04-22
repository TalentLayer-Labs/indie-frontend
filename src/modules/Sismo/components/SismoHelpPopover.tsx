import { QuestionMarkCircle } from 'heroicons-react';
import { useState } from 'react';

function HelpPopover(props: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className='absolute right-[16px] -top-2.5'>
      <p className='flex items-center text-xs font-light text-gray-500 dark:text-gray-400'>
        <button
          className='p-1'
          onClick={e => {
            setShowHelp(!showHelp);
            e.preventDefault();
          }}>
          <QuestionMarkCircle width={18} />
        </button>
      </p>
      <div
        className={`${
          showHelp ? '' : 'opacity-0 invisible'
        } right-2 top-14 absolute z-10 inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400`}>
        <div className='p-3 space-y-2'>{props.children}</div>
      </div>
    </div>
  );
}

export default HelpPopover;

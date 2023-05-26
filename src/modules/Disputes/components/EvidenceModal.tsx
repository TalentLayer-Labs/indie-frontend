import { useState } from 'react';

interface IMetaEvidenceModalProps {
  id: string;
  partyHandle: string;
  fileHash: string;
  fileTypeExtension: string;
  name: string;
  description: string;
}

function EvidenceModal({
  fileHash,
  partyHandle,
  fileTypeExtension,
  name,
  description,
  id,
}: IMetaEvidenceModalProps) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className={'flex flex-row'} key={id}>
        <p onClick={() => setShow(true)} className={'cursor-pointer hover:underline'}>
          {name}
        </p>
      </div>
      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-7xl h-auto overflow-scroll'>
          <div className='relative bg-white rounded-lg shadow'>
            <div className='flex justify-between text-center items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 text-center'>
                Evidence {' : '}
                {name}
              </h3>
              <button
                onClick={() => setShow(false)}
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center '
                data-modal-toggle='defaultModal'>
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'></path>
                </svg>
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <div className='p-4 rounded-t border-b '>
              <p className='italic text-center text-gray-900'>
                <strong>{partyHandle}</strong> Submitted the following evidence as a{' '}
                {fileTypeExtension} file. Find here its description and access the associated file
                on ipfs.
              </p>
            </div>
            <div className='p-6 space-y-6'>
              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full space-y-6'>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Description</h3>
                <p>{description}</p>
              </div>
              <a
                className={`ml-2 mt-4 px-5 py-2 border rounded-md hover:text-indigo-600 hover:bg-white border-indigo-600 bg-indigo-600 text-white bg-indigo-700'
                }`}
                href={`${process.env.NEXT_PUBLIC_IPFS_BASE_URL}${fileHash}`}
                target='_blank'>
                See evidence file
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EvidenceModal;

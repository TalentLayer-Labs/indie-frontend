import { useState } from 'react';
import { IService, IUser } from '../../types';
import ReviewForm from '../Form/ReviewForm';

function ReviewModal({ service, userToReview }: { service: IService; userToReview: IUser }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className='block text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'
        type='button'
        data-modal-toggle='defaultModal'>
        Create a review
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Create a review</h3>
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
            <div className='p-6 space-y-6'>
              <p className='text-gray-800 text-sm'>
                How did the job go with {userToReview.handle}?
              </p>
              {show && <ReviewForm serviceId={service.id} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewModal;

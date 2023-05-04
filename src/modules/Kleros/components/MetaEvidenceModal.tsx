import { Dispatch, SetStateAction, useState } from 'react';
import { IService } from '../../../types';

interface ProposalData {
  about: string;
  rateToken: string;
  rateAmount: number;
  expirationDate: number;
  videoUrl: string;
}
interface IMetaEvidenceModalProps {
  conditionsValidated: boolean;
  setConditionsValidated: Dispatch<SetStateAction<boolean>>;
  serviceData: IService;
  proposalData?: ProposalData;
}

function MetaEvidenceModal({
  conditionsValidated,
  setConditionsValidated,
  serviceData,
  proposalData,
}: IMetaEvidenceModalProps) {
  const [show, setShow] = useState(false);

  function agreeToConditions() {
    setConditionsValidated(true);
    setShow(false);
  }

  function displayModal() {
    conditionsValidated ? setConditionsValidated(false) : setShow(true);
  }

  return (
    <>
      <input
        id='dispute-conditions'
        type='checkbox'
        value=''
        checked={conditionsValidated}
        onClick={() => displayModal()}
        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
      />
      <label
        htmlFor='default-checkbox'
        className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
        Agree to dispute conditions
      </label>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-7xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900'>Dispute Conditions</h3>
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
              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Title</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      {serviceData?.description?.title}
                    </p>
                  </div>
                </div>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Description</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      {serviceData?.description?.about}
                    </p>
                  </div>
                </div>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Parties</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      <strong>Buyer: </strong>
                      {serviceData?.buyer.handle} : {serviceData?.buyer.address}
                    </p>
                    <p className='text-base leading-4 text-gray-800'>
                      <strong>Seller: </strong>
                      {serviceData?.buyer.handle} : {serviceData?.buyer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => agreeToConditions()}
              type='submit'
              className='px-5 py-2 border border-indigo-600 rounded-md hover:text-indigo-600 hover:bg-white text-white bg-indigo-700'>
              Agree to conditions
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default MetaEvidenceModal;

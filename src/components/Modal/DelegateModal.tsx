import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { renderTokenAmount } from '../../utils/conversion';
import { IPayment, IService, PaymentTypeEnum, ServiceStatusEnum } from '../../types';
import ReleaseForm from '../Form/ReleaseForm';
import { useNetwork, useProvider, useSigner } from 'wagmi';
import { validateDelegation } from '../../contracts/validateDelegation';
import TalentLayerContext from '../../context/talentLayer';
import { config } from '../../config';

function DelegateModal() {
  const [show, setShow] = useState(false);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { user } = useContext(TalentLayerContext);

  const delegateAddress = config.delegation.platform;

  const onSubmit = async () => {
    if (!signer || !provider || !user) {
      return;
    }
    await validateDelegation(user.id, delegateAddress, signer, provider);
    setShow(false);
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_ACTIVE_DELEGATE === 'true' && (
        <button
          onClick={() => setShow(true)}
          className='block text-blue-600 bg-red-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'
          type='button'
          data-modal-toggle='defaultModal'>
          Active Delegation
        </button>
      )}

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Delegate activation</h3>
              {/* close button */}
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
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Information</h3>
              </div>
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '>
              <button
                onClick={() => onSubmit()}
                type='button'
                className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white rounded-lg px-5 py-2.5 text-center'>
                Validate proposal
              </button>
              <button
                onClick={() => setShow(false)}
                type='button'
                className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DelegateModal;

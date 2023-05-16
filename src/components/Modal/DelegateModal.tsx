import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { toggleDelegation } from '../../contracts/toggleDelegation';
import TalentLayerContext from '../../context/talentLayer';
import { config } from '../../config';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import { getUserByAddress } from '../../queries/users';

function DelegateModal() {
  const [show, setShow] = useState(false);
  const [hasPlatformAsDelegate, setHasPlatformAsDelegate] = useState(false);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { user } = useContext(TalentLayerContext);
  const delegateAddress = process.env.NEXT_PUBLIC_DELEGATE_ADDRESS as string;

  if (!user) {
    return;
  }

  const checkDelegateState = async () => {
    const getUser = await getUserByAddress(user.address);
    const delegateAddresses = getUser.data?.data?.users[0].delegates;

    if (delegateAddresses && delegateAddresses.indexOf(delegateAddress.toLowerCase()) != -1) {
      setHasPlatformAsDelegate(true);
    } else {
      setHasPlatformAsDelegate(false);
    }
  };

  useEffect(() => {
    checkDelegateState();
  }, [user, show]);

  const onSubmit = async (validateState: boolean) => {
    const contract = new ethers.Contract(
      config.contracts.talentLayerId,
      TalentLayerID.abi,
      signer!,
    );
    if (!signer || !provider || !user) {
      return;
    }
    await toggleDelegation(user.id, delegateAddress, provider, validateState, contract);

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
              <h3 className='text-xl font-semibold text-gray-900 '>
                Delegate activation information
              </h3>
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
                <div className='flex flex-row'>
                  <h3 className='font-semibold text-gray-900'>Delegation state: </h3>
                  {hasPlatformAsDelegate == true ? (
                    <p className='text-green-500 pl-2'> is active</p>
                  ) : (
                    <p className='text-red-500 pl-2'> is inactive</p>
                  )}
                </div>
                <p>After activating the delegation, all fees will be delegated to the platform.</p>
                <p>
                  By confirming it with the Validate delegation button, you agree to delegate the
                  fees payment for interactions such as service creation and proposal creation.
                </p>
                <p>You can cancel it at any time</p>
              </div>
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '>
              {hasPlatformAsDelegate ? (
                <button
                  onClick={() => onSubmit(false)}
                  type='button'
                  className='hover:text-blue-600 hover:bg-red-50 bg-red-500 text-white rounded-lg px-5 py-2.5 text-center'>
                  Cancel Delegation
                </button>
              ) : (
                <button
                  onClick={() => onSubmit(true)}
                  type='button'
                  className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white rounded-lg px-5 py-2.5 text-center'>
                  Validate Delegation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DelegateModal;

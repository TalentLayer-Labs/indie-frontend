import { useState } from 'react';
import { renderTokenAmountFromConfig } from '../../utils/conversion';
import { IReferralGain } from '../../types';
import { useProvider, useSigner } from 'wagmi';
import { claimReferralBalance } from '../../contracts/escrowFunctions';

interface IReferralModalProps {
  userId: string;
  referralGains: IReferralGain[];
}

function ClaimReferralBalanceModal({ userId, referralGains }: IReferralModalProps) {
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const [show, setShow] = useState(false);

  const handleClaim = async (tokenAddress: string) => {
    if (signer) {
      try {
        await claimReferralBalance(userId, tokenAddress, signer, provider);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <button onClick={() => setShow(true)} type='button' data-modal-toggle='defaultModal'>
        Claim balance !
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Claim your referral balances</h3>
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
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>
                  Available balances:
                </h3>
                <div className='flex space-y-4 flex-col border-gray-200 border-b pb-4'>
                  {referralGains.map(gain => (
                    <div className='flex flex-row gap-2'>
                      <p className='text-base leading-4 text-gray-800'>
                        {renderTokenAmountFromConfig(gain.token.address, gain.availableBalance)}
                      </p>
                      <button
                        onClick={() => handleClaim(gain.token.address)}
                        className='ml-2 self-start text-indigo-600 bg-indigo-50 text-xs hover:bg-indigo-500 hover:text-white px-3 py-1 rounded-lg'>
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClaimReferralBalanceModal;

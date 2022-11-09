import { useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { releasePayment } from '../../contracts/releasePayment';
import { renderTokenAmount } from '../../services/Conversion';
import { IPayment, IService, PaymentTypeEnum } from '../../types';

function PaymentModal({ service, payments }: { service: IService; payments: IPayment[] }) {
  const { data: signer, refetch: refetchSigner } = useSigner();
  const { provider } = useProvider();
  const [show, setShow] = useState(false);

  const rateToken = service.validatedProposal[0].rateToken;
  const rateAmount = service.validatedProposal[0].rateAmount;

  useEffect(() => {
    (async () => {
      await refetchSigner({ chainId: 5 });
    })();
  }, []);

  const onSubmit = async () => {
    if (!signer || !provider) {
      return;
    }

    const halfAmount = ethers.BigNumber.from(rateAmount).div(2);
    await releasePayment(signer, provider, service.transactionId, halfAmount);
    setShow(false);
  };

  const totalPayments = payments.reduce((acc, payment) => {
    return acc.add(ethers.BigNumber.from(payment.amount));
  }, ethers.BigNumber.from('0'));

  const totalInEscrow = ethers.BigNumber.from(rateAmount).sub(totalPayments);

  console.log({
    totalPayments: totalPayments.toString(),
    totalInEscrow: totalInEscrow.toString(),
    payments,
    service,
  });

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className='block text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'
        type='button'
        data-modal-toggle='defaultModal'>
        Release payment
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Realease payment</h3>
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
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Payments summary</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base leading-4 text-gray-800'>Job rate</p>
                    <p className='text-base  leading-4 text-gray-600'>
                      {renderTokenAmount(rateToken, rateAmount)}
                    </p>
                  </div>
                  {payments.map(payment => (
                    <div className='flex justify-between w-full'>
                      <p className='text-base leading-4 text-gray-800'>
                        {payment.paymentType == PaymentTypeEnum.Release ? 'Realease' : 'Reimbourse'}
                      </p>
                      <p className='text-base  leading-4 text-gray-600'>
                        -{renderTokenAmount(rateToken, payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='flex justify-between items-center w-full'>
                  <p className='text-base font-semibold leading-4 text-gray-800'>
                    Total in the escrow
                  </p>
                  <p className='text-base  font-semibold leading-4 text-gray-600'>
                    {renderTokenAmount(rateToken, totalInEscrow.toString())}
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '>
              {totalInEscrow.gt(0) && (
                <button
                  onClick={() => onSubmit()}
                  type='button'
                  className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white rounded-lg px-5 py-2.5 text-center'>
                  Realease 50%
                </button>
              )}
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

export default PaymentModal;

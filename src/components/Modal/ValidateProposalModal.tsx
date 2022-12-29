import { ethers } from 'ethers';
import { Check, X } from 'heroicons-react';
import { useContext, useEffect, useState } from 'react';
import { validateProposal } from '../../contracts/acceptProposal';
import { renderTokenAmount } from '../../utils/conversion';
import { IAccount, IProposal } from '../../types';
import Step from '../Step';
import useFees from '../../hooks/useFees';
import { FEE_RATE_DIVIDER } from '../../config';
import { useBalance, useProvider, useSigner } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import PushContext from '../../messaging/context/pushUser';

function ValidateProposalModal({ proposal, account }: { proposal: IProposal; account: IAccount }) {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { initPush, pushUser } = useContext(PushContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const [show, setShow] = useState(false);
  const { data: ethBalance } = useBalance({ address: account.address });
  const isProposalUseEth: boolean = proposal.rateToken.address === ethers.constants.AddressZero;
  const { data: tokenBalance } = useBalance({
    address: account.address,
    enabled: !isProposalUseEth,
    token: proposal.rateToken.address,
  });
  const navigate = useNavigate();

  const { protocolFeeRate, originPlatformFeeRate, platformFeeRate } = useFees();

  const jobRateAmount = ethers.BigNumber.from(proposal.rateAmount);
  const protocolFee = jobRateAmount.mul(protocolFeeRate).div(FEE_RATE_DIVIDER);
  const originPlatformFee = jobRateAmount.mul(originPlatformFeeRate).div(FEE_RATE_DIVIDER);
  const platformFee = jobRateAmount.mul(platformFeeRate).div(FEE_RATE_DIVIDER);
  const totalAmount = jobRateAmount.add(originPlatformFee).add(platformFee).add(protocolFee);

  const onSubmit = async () => {
    if (!signer || !provider) {
      return;
    }
    await validateProposal(
      signer,
      provider,
      proposal.service.id,
      proposal.seller.id,
      proposal.rateToken.address,
      totalAmount,
    );
    setShow(false);
  };

  const hasEnoughBalance = () => {
    if (isProposalUseEth) {
      if (!ethBalance) return;
      return ethBalance.value.gte(totalAmount);
    } else {
      if (!tokenBalance) return;
      return tokenBalance.value.gte(totalAmount);
    }
  };

  const handleMessageUser = async () => {
    console.log('handleMessageUser', pushUser);
    if (pushUser && initPush) {
      console.log('handleMessageUser inside');
      await initPush(account.address as string);
    }
    navigate(`/messaging/${ethers.utils.getAddress(proposal.seller?.address)}`);
  };

  return (
    <>
      <button
        className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
        onClick={() => {
          handleMessageUser();
        }}>
        Contact {proposal.seller.handle}
      </button>
      <button
        onClick={() => setShow(true)}
        className='block text-green-600 bg-green-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'
        type='button'
        data-modal-toggle='defaultModal'>
        Validate proposal
      </button>

      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Proposal validation</h3>
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
              {!isProposalUseEth && (
                <nav className='mb-8'>
                  <ol
                    role='list'
                    className='divide-y divide-gray-200 rounded-md border border-gray-200 md:flex md:divide-y-0'>
                    <Step title='Allow spending' status={'inprogress'} order={1} />
                    <Step
                      title='Send money to escrow and validate the proposal'
                      status={'todo'}
                      order={2}
                      isLast={true}
                    />
                  </ol>
                </nav>
              )}
              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Summary</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4'>
                  <div className='flex justify-between w-full'>
                    <p className='text-base leading-4 text-gray-800'>Job rate</p>
                    <p className='text-base  leading-4 text-gray-600'>
                      {renderTokenAmount(proposal.rateToken.address, proposal.rateAmount)}
                    </p>
                  </div>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      Marketplace fees{' '}
                      <span className='bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800'>
                        {(Number(platformFeeRate) / FEE_RATE_DIVIDER).toString()} %
                      </span>
                    </p>
                    <p className='text-base  leading-4 text-gray-600'>
                      +{renderTokenAmount(proposal.rateToken.address, platformFee.toString())}
                    </p>
                  </div>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      Origin Marketplace fees{' '}
                      <span className='bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800'>
                        {(Number(originPlatformFeeRate) / FEE_RATE_DIVIDER).toString()} %
                      </span>
                    </p>
                    <p className='text-base  leading-4 text-gray-600'>
                      +{renderTokenAmount(proposal.rateToken.address, originPlatformFee.toString())}
                    </p>
                  </div>
                  <div className='flex justify-between items-center w-full'>
                    <p className='text-base leading-4 text-gray-800'>
                      Protocol fees{' '}
                      <span className='bg-gray-200 p-1 text-xs font-medium leading-3 text-gray-800'>
                        {(Number(protocolFeeRate) / FEE_RATE_DIVIDER).toString()} %
                      </span>
                    </p>
                    <p className='text-base  leading-4 text-gray-600'>
                      +{renderTokenAmount(proposal.rateToken.address, protocolFee.toString())}
                    </p>
                  </div>
                </div>
                <div className='flex justify-between items-center w-full'>
                  <p className='text-base font-semibold leading-4 text-gray-800'>Total</p>
                  <p className='text-base  font-semibold leading-4 text-gray-600'>
                    {renderTokenAmount(proposal.rateToken.address, totalAmount.toString())}
                  </p>
                </div>
              </div>

              <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                <h3 className='text-xl font-semibold leading-5 text-gray-800'>Your balances</h3>
                <div className='flex justify-center items-center w-full space-y-4 flex-col'>
                  {tokenBalance && (
                    <div className='flex justify-between w-full'>
                      <p className='text-base leading-4 text-gray-800'>
                        {tokenBalance.formatted} {tokenBalance.symbol}
                      </p>
                      <p className=''>
                        <span
                          className={`block ${
                            hasEnoughBalance() ? 'bg-green-500' : 'bg-red-500'
                          } p-1 text-xs font-medium text-white rounded-full`}>
                          {hasEnoughBalance() ? (
                            <Check className='w-4 h-4' />
                          ) : (
                            <X className='w-4 h-4' />
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                  {ethBalance && (
                    <div className='flex justify-between w-full'>
                      <p className='text-base leading-4 text-gray-800'>
                        {ethBalance.formatted} ETH
                      </p>
                      <p className=''>
                        <span
                          className={`block ${
                            (isProposalUseEth && hasEnoughBalance()) || ethBalance.value.gt(0)
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          } p-1 text-xs font-medium text-white rounded-full`}>
                          {(isProposalUseEth && hasEnoughBalance()) || ethBalance.value.gt(0) ? (
                            <Check className='w-4 h-4' />
                          ) : (
                            <X className='w-4 h-4' />
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '>
              {hasEnoughBalance() ? (
                <button
                  onClick={() => onSubmit()}
                  type='button'
                  className='hover:text-green-600 hover:bg-green-50 bg-green-500 text-white rounded-lg px-5 py-2.5 text-center'>
                  {isProposalUseEth ? 'Validate proposal' : 'Allow spending'}
                </button>
              ) : (
                <button
                  disabled
                  type='button'
                  className='hover:text-red-600 hover:bg-red-50 bg-red-500 text-white rounded-lg px-5 py-2.5 text-center'>
                  Validate proposal
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

export default ValidateProposalModal;

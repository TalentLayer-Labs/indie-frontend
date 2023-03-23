import { useCallback } from 'react';
import ToastStep from './ToastStep';
import { renderExplorerName, renderExplorerUri } from '../utils/network';

function MultiStepsTransactionToast({
  transactionHash,
  currentStep,
  hasOffchainData = true,
}: {
  transactionHash: string;
  currentStep: number;
  hasOffchainData?: boolean;
}) {
  const renderTransaction = useCallback(() => {
    const explorerUri = renderExplorerUri();

    return (
      <a
        className='flex flex-col text-sm font-normal w-full pt-2'
        target='_blank'
        href={`${explorerUri}${transactionHash}`}>
        <span className='inline-flex full-w justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 '>
          {renderExplorerName()}
        </span>
      </a>
    );
  }, [transactionHash]);

  const steps = [
    {
      title: 'Execute the transaction',
      status: currentStep > 1 ? 'complete' : 'current',
      render: renderTransaction,
    },
    {
      title: 'Synchronize onChain data',
      status: currentStep > 2 ? 'complete' : currentStep == 2 ? 'current' : 'upcomming',
    },
    {
      title: 'Synchronize offChain data',
      status: currentStep > 3 ? 'complete' : currentStep == 3 ? 'current' : 'upcomming',
    },
  ];

  if (!hasOffchainData) {
    steps.splice(2, 1);
  }

  return (
    <div className='py-6 px-2'>
      <nav className='flex' aria-label='Progress'>
        <ol role='list' className='space-y-6'>
          {steps.map((step, index) => (
            <ToastStep key={index} title={step.title} status={step.status}>
              {step.render || null}
            </ToastStep>
          ))}
        </ol>
      </nav>
    </div>
  );
}
export default MultiStepsTransactionToast;

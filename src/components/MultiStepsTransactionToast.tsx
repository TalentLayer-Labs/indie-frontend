import { useCallback } from 'react';
import ToastStep from './ToastStep';

function MultiStepsTransactionToast({
  message,
  transactionHash,
  currentStep,
}: {
  message: string;
  transactionHash: string;
  currentStep: number;
}) {
  const renderTransaction = useCallback(() => {
    return (
      <a
        className='flex flex-col text-sm font-normal w-full pt-2'
        target='_blank'
        href={`https://goerli.etherscan.io/tx/${transactionHash}`}>
        <span className='inline-flex full-w justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 '>
          Check on etherscan
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
      title: 'Synchronize with The Graph',
      status: currentStep > 2 ? 'complete' : currentStep == 2 ? 'current' : 'upcomming',
    },
    {
      title: 'Synchronize with IPFS',
      status: currentStep > 3 ? 'complete' : currentStep == 3 ? 'current' : 'upcomming',
    },
  ];

  return (
    <div className='py-6 px-2'>
      <nav className='flex' aria-label='Progress'>
        <ol role='list' className='space-y-6'>
          {steps.map(step => (
            <ToastStep title={step.title} status={step.status}>
              {step.render || null}
            </ToastStep>
          ))}
        </ol>
      </nav>
    </div>
  );
}
export default MultiStepsTransactionToast;

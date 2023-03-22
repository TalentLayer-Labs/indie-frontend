import { useCallback } from 'react';
import ToastStep from './ToastStep';
import { useNetwork } from 'wagmi';

function MultiStepsTransactionToast({
  transactionHash,
  currentStep,
  hasOffchainData = true,
}: {
  transactionHash: string;
  currentStep: number;
  hasOffchainData?: boolean;
}) {
  const network = useNetwork();
  const chainId = network?.chain?.id;
  const renderExplorerUri = (chainId?: number) => {
    switch (chainId) {
      case 1:
        return 'https://etherscan.io/tx/';
      case 5:
        return 'https://goerli.etherscan.io/tx/';
      case 1337:
        return 'Localhost';
      case 43113:
        return 'https://testnet.snowtrace.io/tx/';
      case 80001:
        return 'https://mumbai.polygonscan.com/tx/';
      case 137:
        return 'https://polygonscan.com/tx/';
      default:
        return 'Unknown';
    }
  };
  const renderExplorerName = (chainId?: number) => {
    switch (chainId) {
      case 1:
        return 'Check on etherscan';
      case 5:
        return 'Check on goerli etherscan';
      case 1337:
        return 'Localhost';
      case 43113:
        return 'Check on snowtrace';
      case 80001:
        return 'Check on mumbai polygonscan';
      case 137:
        return 'https://polygonscan.com/tx/';
      default:
        return 'Unknown';
    }
  };
  const renderTransaction = useCallback(() => {
    const explorerUri = renderExplorerUri(chainId);
    if (explorerUri === 'Localhost' || explorerUri === 'Unknown') return <></>;
    return (
      <a
        className='flex flex-col text-sm font-normal w-full pt-2'
        target='_blank'
        href={`${explorerUri}${transactionHash}`}>
        <span className='inline-flex full-w justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 '>
          {renderExplorerName(chainId)}
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

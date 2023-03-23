import { useNetwork } from 'wagmi';

function TransactionToast({
  message,
  transactionHash,
}: {
  message: string;
  transactionHash: string;
}) {
  const network = useNetwork();
  return (
    <a
      className='flex flex-col text-sm font-normal'
      target='_blank'
      href={`${network.chain?.blockExplorers?.default.url}/tx/${transactionHash}`}>
      <span className='mb-1 text-sm font-semibold text-gray-900'>New transaction</span>
      <div className='mb-2 text-sm font-normal'>{message}</div>
      <span className='inline-flex full-w justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 '>
        Follow on {network.chain?.blockExplorers?.default.name}
      </span>
    </a>
  );
}
export default TransactionToast;

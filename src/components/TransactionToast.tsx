import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';

function TransactionToast({
  message,
  transactionHash,
}: {
  message: string;
  transactionHash: string;
}) {
  const { account } = useContext(TalentLayerContext);
  const chain = account?.connector?.chains[0];
  return (
    <a
      className='flex flex-col text-sm font-normal'
      target='_blank'
      href={`${chain?.blockExplorers?.default.url}/tx/${transactionHash}`}>
      <span className='mb-1 text-sm font-semibold text-gray-900'>New transaction</span>
      <div className='mb-2 text-sm font-normal'>{message}</div>
      <span className='inline-flex full-w justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 '>
        Follow on {chain?.blockExplorers?.default.name}
      </span>
    </a>
  );
}
export default TransactionToast;

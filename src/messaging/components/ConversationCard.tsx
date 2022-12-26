import { shortAddress, truncate } from '../utils/messaging';
import { DecodedMessage } from '@xmtp/xmtp-js';
import useUserByAddress from '../../hooks/useUserByAddress';
import { useNavigate } from 'react-router-dom';

interface IConversationCardProps {
  peerAddress: string;
  // isConvSelected: boolean;
  latestMessage?: string;
}

const ConversationCard = ({
  peerAddress,
  // isConvSelected,
  latestMessage,
}: IConversationCardProps) => {
  const user = useUserByAddress(peerAddress);
  const navigate = useNavigate();
  console.log('peerAddress', peerAddress);
  console.log('latestMessage', latestMessage);

  // Display or not non TL profiles
  // if (!user?.id) return;

  // const isActiveConversation = () => return key === address;

  const handleSelectConversation = () => {
    navigate(`/messaging/${peerAddress}`);
  };

  //${isConvSelected ? 'border-indigo-500 border-2' : 'border-b-2'}

  return (
    <div
      onClick={() => handleSelectConversation()}
      // onClick={() => setSelectedConversationPeerAddress(address)}
      className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 cursor-pointer 
      `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-full'>
        {user && user.handle ? <b>{user.handle}</b> : <b>{shortAddress(peerAddress)}</b>}
        <p className='text-s font-medium text-gray-500'>
          {latestMessage && truncate(latestMessage, 75)}
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;

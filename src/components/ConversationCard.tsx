import { shortAddress, truncate } from '../utils/messaging';
import { useEnsAvatar } from 'wagmi';
import { useContext, Dispatch, SetStateAction } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { DecodedMessage } from '@xmtp/xmtp-js';
import useUserByAddress from '../hooks/useUserByAddress';
import { useNavigate } from 'react-router-dom';

interface IConversationCardProps {
  address: string;
  // setSelectedConversationPeerAddress: Dispatch<SetStateAction<string>>;
  latestMessage?: DecodedMessage;
}

const ConversationCard = ({
  // setSelectedConversationPeerAddress,
  address,
  latestMessage,
}: IConversationCardProps) => {
  const user = useUserByAddress(address);
  const navigate = useNavigate();

  // Display or not non TL profiles
  // if (!user?.id) return;

  // const isActiveConversation = () => return key === address;

  const handleSelectConversation = () => {
    console.log('handleSelectConversation', address);
    navigate(`/messaging/${address}`);
  };

  return (
    <div
      onClick={() => handleSelectConversation()}
      // onClick={() => setSelectedConversationPeerAddress(address)}
      className={`flex justify-start py-4 px-2 justify-center items-center border-b-2 cursor-pointer `}>
      <div className='w-1/4'>
        <img
          src={`/default-avatar-${Number(user?.id ? user.id : '1') % 11}.jpeg`}
          className='object-cover h-12 w-12 rounded-full'
          alt=''
        />
      </div>
      <div className='w-full'>
        {user && user.handle ? <b>{user.handle}</b> : <b>{shortAddress(address)}</b>}
        <p className='text-s font-medium text-gray-500'>
          {latestMessage && truncate(latestMessage.content, 75)}
        </p>
      </div>
    </div>
  );
};

export default ConversationCard;

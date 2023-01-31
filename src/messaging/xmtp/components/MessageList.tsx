import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';

interface IMessageListProps {
  conversationMessages: DecodedMessage[];
  selectedConversationPeerAddress: string;
  peerUserId: string;
  userId: string;
}

const MessageList = ({
  conversationMessages,
  selectedConversationPeerAddress,
  peerUserId,
  userId,
}: IMessageListProps) => {
  useStreamMessages(selectedConversationPeerAddress, userId, peerUserId);

  return (
    <div className=''>
      <div className='flex flex-col mt-5'>
        {conversationMessages.map(msg => {
          return <MessageCard key={msg.id} message={msg} />;
        })}
      </div>
    </div>
  );
};

export default MessageList;

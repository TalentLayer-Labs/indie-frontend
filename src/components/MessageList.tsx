import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';
import useUserByAddress from '../hooks/useUserByAddress';

interface IMessageListProps {
  conversationMessages: DecodedMessage[];
  selectedConversationPeerAddress: string;
}

const MessageList = ({
  conversationMessages,
  selectedConversationPeerAddress,
}: IMessageListProps) => {
  useStreamMessages(selectedConversationPeerAddress);

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

import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';

interface IMessageListProps {
  isNewMsg: boolean;
  conversationMessages: DecodedMessage[];
  selectedConversationPeerAddress: string;
}

const MessageList = ({
  isNewMsg,
  conversationMessages,
  selectedConversationPeerAddress,
}: IMessageListProps) => {
  useStreamMessages(selectedConversationPeerAddress);

  return (
    <div className=''>
      <div className='flex flex-col mt-5'>
        {!isNewMsg &&
          conversationMessages.map(msg => {
            return <MessageCard key={msg.id} message={msg} />;
          })}
      </div>
    </div>
  );
};

export default MessageList;

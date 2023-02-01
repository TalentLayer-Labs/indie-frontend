import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { isDateOnSameDay } from '../utils/messaging';

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
  let lastMessageDate: Date | undefined;

  return (
    <div className='flex flex-col mt-5'>
      //TODO handle this
      {/*{!isNewMessage && conversationMessages.length === 0 && selectedConversationPeerAddress && (*/}
      {/*  <Loading />*/}
      {/*)}*/}
      {conversationMessages.map((msg, index) => {
        const messageCard = (
          <div key={index}>
            {index === 0 && <ConversationBeginningNotice />}
            <MessageCard
              key={msg.id}
              message={msg}
              dateHasChanged={!isDateOnSameDay(msg.sent, lastMessageDate)}
            />
          </div>
        );
        lastMessageDate = msg.sent;
        return messageCard;
      })}
    </div>
  );
};

const ConversationBeginningNotice = (): JSX.Element => (
  <div className='flex align-items-center justify-center pb-4 mt-4'>
    <span className='text-gray-300 text-sm font-semibold'>
      This is the beginning of the conversation
    </span>
  </div>
);

export default MessageList;

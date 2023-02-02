import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { isDateOnSameDay } from '../utils/messaging';
import { XmtpChatMessage } from '../../../types';

interface IMessageListProps {
  conversationMessages: XmtpChatMessage[];
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
      {/*TODO handle this*/}
      {/*{!isNewMessage && conversationMessages.length === 0 && selectedConversationPeerAddress && (*/}
      {/*  <Loading />*/}
      {/*)}*/}
      {conversationMessages.map((msg, index) => {
        const messageCard = (
          <div key={index}>
            {index === 0 && <ConversationBeginningNotice />}
            <MessageCard
              key={msg.from}
              message={msg}
              dateHasChanged={!isDateOnSameDay(msg.timestamp as Date, lastMessageDate)}
            />
          </div>
        );
        lastMessageDate = msg.timestamp as Date;
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

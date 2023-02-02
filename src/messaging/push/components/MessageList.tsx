import MessageCard from './MessageCard';
import { isTimestampOnSameDay } from '../utils/messaging';
import Loading from '../../../components/Loading';
import { useLayoutEffect, useRef } from 'react';
import { PushChatMessage } from '../../../types';

interface IMessageListProps {
  conversationMessages: PushChatMessage[];
  messagesLoaded: boolean;
  selectedConversationPeerAddress: boolean;
  isNewMessage?: boolean;
}

const MessageList = ({
  selectedConversationPeerAddress,
  conversationMessages,
  isNewMessage,
}: IMessageListProps) => {
  let lastMessageDate: number | undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    console.log('fire');
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <>
      <div className='flex flex-col mt-5'>
        {!isNewMessage && conversationMessages.length === 0 && selectedConversationPeerAddress && (
          <Loading />
        )}
      </div>
      <div className='flex flex-col mt-5 overflow-y-auto'>
        {conversationMessages.map((msg, index) => {
          const messageCard = (
            <div key={index}>
              {index === 0 && <ConversationBeginningNotice />}
              <MessageCard
                message={msg}
                dateHasChanged={!isTimestampOnSameDay(msg.timestamp, lastMessageDate)}
              />
            </div>
          );
          lastMessageDate = msg.timestamp;
          return messageCard;
        })}
        <div ref={bottomRef}></div>
      </div>
    </>
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

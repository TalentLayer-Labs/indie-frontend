import MessageCard from './MessageCard';
import { isOnSameDay } from '../utils/messaging';
import Loading from '../../components/Loading';
import { useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';

interface IMessageListProps {
  conversationMessages: ChatMessage[];
  messagesLoaded: boolean;
  selectedConversationPeerAddress: boolean;
}

const MessageList = ({
  selectedConversationPeerAddress,
  messagesLoaded,
  conversationMessages,
}: IMessageListProps) => {
  let lastMessageDate: number | undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages, messagesLoaded]);

  return (
    <>
      <div className='flex flex-col mt-5'>
        {conversationMessages.length === 0 && selectedConversationPeerAddress && <Loading />}
      </div>
      <div className='flex flex-col mt-5 overflow-y-auto'>
        {conversationMessages.map((msg, index) => {
          const messageCard = (
            <div key={index}>
              {index === 0 && <ConversationBeginningNotice />}
              <MessageCard
                message={msg}
                dateHasChanged={!isOnSameDay(msg.timestamp, lastMessageDate)}
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

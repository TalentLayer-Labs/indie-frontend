import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { isDateOnSameDay } from '../utils/messaging';
import { XmtpChatMessage } from '../../../types';
import Loading from '../../../components/Loading';
import { useLayoutEffect, useRef } from 'react';

interface IMessageListProps {
  conversationMessages: XmtpChatMessage[];
  selectedConversationPeerAddress: string;
  peerUserId: string;
  userId: string;
  messagesLoading: boolean;
  setMessageSendingErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  peerUserExists: boolean;
  isNewMessage?: boolean;
}

const MessageList = ({
  conversationMessages,
  selectedConversationPeerAddress,
  peerUserId,
  userId,
  messagesLoading,
  setMessageSendingErrorMsg,
  peerUserExists,
  isNewMessage,
}: IMessageListProps) => {
  // TODO: We only listen to the active conversation
  useStreamMessages(selectedConversationPeerAddress, userId, peerUserId, setMessageSendingErrorMsg);
  let lastMessageDate: Date | undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    console.log('fire');
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  });

  // console.log('messagesLoading', messagesLoading);
  // console.log('isNewMessage', isNewMessage);
  // console.log('peerUserExists', peerUserExists);
  // console.log('conversationMessages.length', conversationMessages.length);
  // console.log('selectedConversationPeerAddress', selectedConversationPeerAddress);
  return (
    <div className='flex flex-col mt-5'>
      {
        // isNewMessage ||
        // !peerUserExists ||
        // (conversationMessages.length === 0 && selectedConversationPeerAddress && (
          messagesLoading &&
          <Loading />
        // ))
      }
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
      <div ref={bottomRef}></div>
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

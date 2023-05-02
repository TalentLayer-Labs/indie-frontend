import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { isDateOnSameDay } from '../utils/messaging';
import Loading from '../../../components/Loading';
import { useContext, useEffect, useRef } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import { XmtpChatMessage } from '../utils/types';

interface IMessageListProps {
  conversationMessages: XmtpChatMessage[];
  selectedConversationPeerAddress: string;
  peerUserId: string;
  userId: string;
  messagesLoading: boolean;
  sendingPending: boolean;
  setMessageSendingErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}

const MessageList = ({
  conversationMessages,
  selectedConversationPeerAddress,
  peerUserId,
  userId,
  messagesLoading,
  sendingPending,
  setMessageSendingErrorMsg,
}: IMessageListProps) => {
  const { providerState } = useContext(XmtpContext);
  //We only listen to the active selected conversation
  useStreamMessages(selectedConversationPeerAddress, userId, peerUserId, setMessageSendingErrorMsg);
  let lastMessageDate: Date | undefined;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sendingPending, conversationMessages, bottomRef, providerState]);

  return (
    <div className='flex flex-col mt-5'>
      {messagesLoading && <Loading />}
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
      <div ref={bottomRef} id='scroller'></div>
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

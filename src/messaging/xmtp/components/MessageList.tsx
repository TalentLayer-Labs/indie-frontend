import useStreamMessages from '../hooks/useStreamMessages';
import MessageCard from './MessageCard';
import { isDateOnSameDay } from '../utils/messaging';
import { XmtpChatMessage } from '../../../types';
import Loading from '../../../components/Loading';

interface IMessageListProps {
  conversationMessages: XmtpChatMessage[];
  selectedConversationPeerAddress: string;
  peerUserId: string;
  userId: string;
  conversationLoading: boolean;
  setMessageSendingErrorMsg: React.Dispatch<React.SetStateAction<string>>;
  isNewMessage?: boolean;
}

const MessageList = ({
  conversationMessages,
  selectedConversationPeerAddress,
  peerUserId,
  userId,
  conversationLoading,
  setMessageSendingErrorMsg,
  isNewMessage,
}: IMessageListProps) => {
  // TODO: We only listen to the active conversation
  useStreamMessages(selectedConversationPeerAddress, userId, peerUserId, setMessageSendingErrorMsg);
  let lastMessageDate: Date | undefined;

  // console.log('conversationMessages', conversationMessages);
  // console.log('conversationLoading', conversationLoading);
  // console.log('selectedConversationPeerAddress', selectedConversationPeerAddress);
  // console.log('isNewMessage', isNewMessage);
  return (
    <div className='flex flex-col mt-5'>
      {!isNewMessage &&
        conversationMessages.length === 0 &&
        selectedConversationPeerAddress &&
        conversationLoading && <Loading />}
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

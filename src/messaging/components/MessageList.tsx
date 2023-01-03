import MessageCard from './MessageCard';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { isOnSameDay } from '../utils/messaging';

interface IMessageListProps {
  conversationMessages: IMessageIPFS[];
}

const MessageList = ({ conversationMessages }: IMessageListProps) => {
  let lastMessageDate: number | undefined;

  return (
    <div className='flex flex-col mt-5'>
      {conversationMessages.map((msg, index) => {
        const messageCard = (
          <>
            {index === 0 && <ConversationBeginningNotice />}
            <MessageCard
              key={index}
              message={msg}
              dateHasChanged={!isOnSameDay(msg.timestamp, lastMessageDate)}
            />
          </>
        );
        lastMessageDate = msg.timestamp;
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

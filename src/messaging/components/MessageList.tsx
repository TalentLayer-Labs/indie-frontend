import MessageCard from './MessageCard';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';

interface IMessageListProps {
  conversationMessages: IMessageIPFS[];
}

const MessageList = ({ conversationMessages }: IMessageListProps) => {
  return (
    <div className=''>
      <div className='flex flex-col mt-5'>
        {conversationMessages.map((msg, index) => {
          return <MessageCard key={index} message={msg} />;
        })}
      </div>
    </div>
  );
};

export default MessageList;

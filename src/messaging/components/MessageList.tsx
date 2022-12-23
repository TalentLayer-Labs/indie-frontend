import MessageCard from './MessageCard';

interface IMessageListProps {
  selectedConversationPeerAddress: string;
  peerUserId: string;
  userId: string;
}

const MessageList = ({
  selectedConversationPeerAddress,
  peerUserId,
  userId,
}: IMessageListProps) => {
  return (
    <div className=''>
      <div className='flex flex-col mt-5'>
        {/*{conversationMessages.map(msg => {*/}
        {/*  return <MessageCard key={msg.id} message={msg} />;*/}
        {/*})}*/}
      </div>
    </div>
  );
};

export default MessageList;

import ConversationCard from './ConversationCard';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { ConversationDisplayType } from '../../types';
import Loading from '../../components/Loading';

interface IConversationListProps {
  conversations: Message[];
  conversationDisplayType: string;
  selectedConversationPeerAddress: string;
  conversationsLoaded: boolean;
  setPageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConversationList = ({
  conversations,
  conversationDisplayType,
  selectedConversationPeerAddress,
  conversationsLoaded,
  setPageLoaded,
}: IConversationListProps) => {
  return (
    <>
      <div className='flex flex-col mt-5'>{!conversationsLoaded && <Loading />}</div>
      {conversationsLoaded &&
        conversations.map(message => {
          return (
            <ConversationCard
              key={message.toCAIP10}
              peerAddress={
                conversationDisplayType == ConversationDisplayType.CONVERSATION
                  ? message.toCAIP10
                  : message.fromCAIP10
              }
              latestMessage={message.messageContent}
              latestMessageTimestamp={message.timestamp}
              address={
                conversationDisplayType == ConversationDisplayType.CONVERSATION
                  ? message.fromCAIP10
                  : message.toCAIP10
              }
              conversationDisplayType={conversationDisplayType}
              selectedConversationPeerAddress={selectedConversationPeerAddress}
              setPageLoaded={setPageLoaded}
            />
          );
        })}
    </>
  );
};

export default ConversationList;

import ConversationCard from './ConversationCard';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { ConversationDisplayType } from '../../types';

interface IConversationListProps {
  conversations: Message[];
  conversationDisplayType: string;
  selectedConversationPeerAddress: string;
}

const ConversationList = ({
  conversations,
  conversationDisplayType,
  selectedConversationPeerAddress,
}: IConversationListProps) => {
  return (
    <>
      {conversations.map(message => {
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
          />
        );
      })}
    </>
  );
};

export default ConversationList;

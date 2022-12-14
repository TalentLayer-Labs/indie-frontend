import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';

interface IConversationListProps {
  conversationMessages: Map<string, DecodedMessage[]>;
  setSelectedConversation: React.Dispatch<React.SetStateAction<string>>;
}

const ConversationList = ({
  conversationMessages,
  setSelectedConversation,
}: IConversationListProps) => {
  const sortedConversations = new Map(
    [...conversationMessages.entries()].sort((convA, convB) => {
      return getLatestMessage(convA[1])?.sent < getLatestMessage(convB[1])?.sent ? 1 : -1;
    }),
  );
  // console.log('conversationMessages', conversationMessages);
  // console.log('sortedConversations', sortedConversations);

  return (
    <>
      {Array.from(sortedConversations.keys()).map(address => {
        console.log('Conversation for address', sortedConversations.get(address));
        // if (sortedConversations.get(address).length > 0) {
        return (
          // <MessageCard peerAddress={address} />
          <ConversationCard
            key={address}
            setSelectedConversation={setSelectedConversation}
            address={address}
            // latestMessage={getLatestMessage(sortedConversations.get(address))}
          />
        );
        // } else return null;
      })}
    </>
  );
};

export default ConversationList;

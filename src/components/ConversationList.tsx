import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import MessageCard from './MessageCard';
import { DecodedMessage } from '@xmtp/xmtp-js';

interface IConversationListProps {
  conversationMessages: Map<string, DecodedMessage[]>;
  setSelectedConversationPeerAddress: React.Dispatch<React.SetStateAction<string>>;
}

const ConversationList = ({
  conversationMessages,
  setSelectedConversationPeerAddress,
}: IConversationListProps) => {
  const sortedConversations: Map<string, DecodedMessage[]> | undefined = new Map(
    [...conversationMessages.entries()].sort((convA, convB) => {
      return getLatestMessage(convA[1])?.sent < getLatestMessage(convB[1])?.sent ? 1 : -1;
    }),
  );
  // console.log('conversationMessages', conversationMessages);
  // console.log('sortedConversations', sortedConversations);

  return (
    <>
      {Array.from(sortedConversations.keys()).map(address => {
        // if (sortedConversations.get(address).length > 0) {
        return (
          // <MessageCard peerAddress={address} />
          <ConversationCard
            key={address}
            setSelectedConversationPeerAddress={setSelectedConversationPeerAddress}
            address={address}
            latestMessage={getLatestMessage(sortedConversations.get(address))}
          />
        );
        // } else return null;
      })}
    </>
  );
};

export default ConversationList;

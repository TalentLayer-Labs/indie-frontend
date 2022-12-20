import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import { DecodedMessage } from '@xmtp/xmtp-js';

interface IConversationListProps {
  conversationMessages: Map<string, DecodedMessage[]>;
  peerAddress: string;
  selectedConversationPeerAddress: string;
}

const ConversationList = ({
  conversationMessages,
  peerAddress,
  selectedConversationPeerAddress,
}: IConversationListProps) => {
  const sortedConversations: Map<string, DecodedMessage[]> | undefined = new Map(
    [...conversationMessages.entries()].sort((convA, convB) => {
      return getLatestMessage(convA[1])?.sent < getLatestMessage(convB[1])?.sent ? 1 : -1;
    }),
  );
  // const isConvSelected = ethers.utils.getAddress(peerAddress) === selectedConversationPeerAddress;
  // console.log('isConvSelected: ', isConvSelected);
  // console.log('peerAddress: ', peerAddress);
  // console.log('selectedConversationPeerAddress: ', selectedConversationPeerAddress);

  return (
    <>
      {Array.from(sortedConversations.keys()).map(peerAddress => {
        // if (sortedConversations.get(peerAddress).length > 0) {
        return (
          <ConversationCard
            key={peerAddress}
            // isConvSelected={isConvSelected}
            peerAddress={peerAddress}
            latestMessage={getLatestMessage(sortedConversations.get(peerAddress))}
          />
        );
      })}
    </>
  );
};

export default ConversationList;

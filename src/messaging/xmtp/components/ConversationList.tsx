import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import { DecodedMessage } from '@xmtp/xmtp-js';
import Loading from '../../../components/Loading';

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
      // if (!getLatestMessage(convA[1])?.sent || !getLatestMessage(convB[1])?.sent) return -1;
      return getLatestMessage(convA[1])?.sent < getLatestMessage(convB[1])?.sent ? 1 : -1;
    }),
  );

  return (
    <>
      //TODO handle this
      {/*<div className='flex flex-col mt-5'>{!conversationsLoaded && <Loading />}</div>*/}
      {Array.from(sortedConversations.keys()).map(peerAddress => {
        // if (sortedConversations.get(peerAddress).length > 0) {
        return (
          <ConversationCard
            key={peerAddress}
            // isConvSelected={isConvSelected}
            peerAddress={peerAddress}
            latestMessage={getLatestMessage(sortedConversations.get(peerAddress))}
            selectedConversationPeerAddress={selectedConversationPeerAddress}
          />
        );
      })}
    </>
  );
};

export default ConversationList;

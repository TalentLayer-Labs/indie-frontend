import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import { XmtpChatMessage } from '../../../types';
import Loading from '../../../components/Loading';

interface IConversationListProps {
  conversationMessages: Map<string, XmtpChatMessage[]>;
  peerAddress: string;
  selectedConversationPeerAddress: string;
  conversationsLoading: boolean;
}

const ConversationList = ({
  conversationMessages,
  peerAddress,
  selectedConversationPeerAddress,
  conversationsLoading,
}: IConversationListProps) => {
  const sortedConversations: Map<string, XmtpChatMessage[]> | undefined = new Map(
    [...conversationMessages.entries()].sort((convA, convB) => {
      // if (!getLatestMessage(convA[1])?.sent || !getLatestMessage(convB[1])?.sent) return -1;
      return getLatestMessage(convA[1])?.timestamp < getLatestMessage(convB[1])?.timestamp ? 1 : -1;
    }),
  );

  return (
    <>
      <div className='flex flex-col mt-5'>{conversationsLoading && <Loading />}</div>
      {!conversationsLoading &&
        Array.from(sortedConversations.keys()).map(peerAddress => {
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

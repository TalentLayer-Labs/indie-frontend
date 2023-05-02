import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import Loading from '../../../components/Loading';
import { XmtpChatMessage } from '../utils/types';

interface IConversationListProps {
  conversationMessages: Map<string, XmtpChatMessage[]>;
  selectedConversationPeerAddress: string;
  conversationsLoading: boolean;
}

const ConversationList = ({
  conversationMessages,
  selectedConversationPeerAddress,
  conversationsLoading,
}: IConversationListProps) => {
  // Sort conversations by latest message timestamp
  const sortedConversations: Map<string, XmtpChatMessage[]> = new Map(
    [...conversationMessages.entries()].sort((convA, convB) => {
      return getLatestMessage(convA[1])?.timestamp < getLatestMessage(convB[1])?.timestamp ? 1 : -1;
    }),
  );

  return (
    <>
      {conversationsLoading && (
        <div className='flex flex-col mt-5'>
          <Loading />
        </div>
      )}
      {!conversationsLoading &&
        Array.from(sortedConversations.keys()).map(peerAddress => {
          return (
            <ConversationCard
              key={peerAddress}
              latestMessage={
                sortedConversations.get(peerAddress)
                  ? getLatestMessage(sortedConversations.get(peerAddress) as XmtpChatMessage[])
                  : undefined
              }
              peerAddress={peerAddress}
              selectedConversationPeerAddress={selectedConversationPeerAddress}
            />
          );
        })}
    </>
  );
};

export default ConversationList;

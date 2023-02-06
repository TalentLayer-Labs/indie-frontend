import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import { XmtpChatMessage } from '../../../types';
import Loading from '../../../components/Loading';

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
      // if (!getLatestMessage(convA[1])?.sent || !getLatestMessage(convB[1])?.sent) return -1;
      //TODO had some issues here with undefined timestamps
      return getLatestMessage(convA[1]).timestamp < getLatestMessage(convB[1]).timestamp ? 1 : -1;
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

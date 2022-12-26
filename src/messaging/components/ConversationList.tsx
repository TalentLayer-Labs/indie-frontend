import { getLatestMessage } from '../utils/messaging';
import ConversationCard from './ConversationCard';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { DecodedMessage } from '@xmtp/xmtp-js';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';

interface IConversationListProps {
  conversations: Message[];
  peerAddress: string;
  selectedConversationPeerAddress: string;
}

const ConversationList = ({
  conversations,
  peerAddress,
  selectedConversationPeerAddress,
}: IConversationListProps) => {
  // const sortedConversations: Map<string, DecodedMessage[]> | undefined = new Map(
  //   [...conversationMessages.entries()].sort((convA, convB) => {
  //     return getLatestMessage(convA[1])?.sent < getLatestMessage(convB[1])?.sent ? 1 : -1;
  //   }),
  // );
  // const isConvSelected = ethers.utils.getAddress(peerAddress) === selectedConversationPeerAddress;
  // console.log('isConvSelected: ', isConvSelected);
  // console.log('peerAddress: ', peerAddress);
  // console.log('selectedConversationPeerAddress: ', selectedConversationPeerAddress);

  return (
    <>
      {conversations.map(message => {
        // if (sortedConversations.get(peerAddress).length > 0) {
        return (
          <ConversationCard
            key={message.toCAIP10}
            // isConvSelected={isConvSelected}
            peerAddress={pCAIP10ToWallet(message.toCAIP10)}
            latestMessage={message.messageContent}
          />
        );
      })}
    </>
  );
};

export default ConversationList;

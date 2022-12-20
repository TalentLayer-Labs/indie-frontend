import { XmtpContext } from '../context/XmtpContext';
import { useContext } from 'react';
import { InvitationContext } from '@xmtp/xmtp-js/dist/types/src/Invitation';
import useUserByAddress from './useUserByAddress';
import { buildConversationId } from '../utils/messaging';

const useSendMessage = (peerAddress: string, senderId: string) => {
  const { providerState } = useContext(XmtpContext);
  const peerUser = useUserByAddress(peerAddress);
  const { client } = providerState || {};
  // console.log('peerAddress', peerAddress);
  // console.log('senderId', senderId);
  // console.log('peerUser', peerUser?.id);
  // console.log('client', client);

  //Normally returns a Promise<DecodedMessage>
  const sendMessage = async (message: any): Promise<void> => {
    if (!client || !peerAddress || !peerUser?.id || !senderId) {
      console.log('really?');
      return;
    }

    const conversationId = buildConversationId(senderId, peerUser.id);
    console.log('conversationId from send message', conversationId);

    //Could add a context to define the linked job
    const context: InvitationContext = {
      conversationId: conversationId,
      metadata: { ['domain']: 'TalentLayer' },
    };
    console.log('peerAddress', peerAddress);
    const conversation = await client.conversations.newConversation(peerAddress, context);

    // const conversation = await client.conversations.newConversation(peerAddress);
    if (!conversation) return;
    await conversation.send(message);
  };

  return {
    sendMessage,
  };
};

export default useSendMessage;

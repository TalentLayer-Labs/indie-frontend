import { XmtpContext } from '../context/XmtpContext';
import { useContext } from 'react';
import { InvitationContext } from '@xmtp/xmtp-js/dist/types/src/Invitation';
import useUserByAddress from '../../../hooks/useUserByAddress';
import { buildConversationId } from '../utils/messaging';
import { DecodedMessage } from '@xmtp/xmtp-js';

const useSendMessage = (peerAddress: string, senderId: string | undefined) => {
  const { providerState } = useContext(XmtpContext);
  const peerUser = useUserByAddress(peerAddress);
  const { client } = providerState || {};
  // console.log('peerAddress', peerAddress);
  // console.log('senderId', senderId);
  console.log('UseSendMessage peerUser', peerUser);
  // console.log('client', client);

  //Normally returns a Promise<DecodedMessage>
  //TODO if implement contentType, check if it's a string or an object
  const sendMessage = async (message: string): Promise<DecodedMessage> => {
    console.log("client, peerAddress, peerUser?.id, senderId", client, peerAddress, peerUser?.id, senderId)
    if (!client || !peerAddress || !peerUser?.id || !senderId) {
      throw new Error('Message sending failed');
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
    if (!conversation) throw new Error('Conversation not found');
    return await conversation.send(message);
  };

  return {
    sendMessage,
  };
};

export default useSendMessage;

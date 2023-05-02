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

  const sendMessage = async (message: string): Promise<DecodedMessage> => {
    if (!client || !peerAddress || !peerUser?.id || !senderId) {
      throw new Error('Message sending failed');
    }

    const conversationId = buildConversationId(senderId, peerUser.id);

    //Could add a context to define the linked job
    const context: InvitationContext = {
      conversationId: conversationId,
      metadata: { ['domain']: 'TalentLayer' },
    };
    const conversation = await client.conversations.newConversation(peerAddress, context);

    if (!conversation) throw new Error('Conversation not found');
    return await conversation.send(message);
  };

  return {
    sendMessage,
  };
};

export default useSendMessage;

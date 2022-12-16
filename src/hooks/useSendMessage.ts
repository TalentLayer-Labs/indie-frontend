import { XmtpContext } from '../context/XmtpContext';
import { useContext } from 'react';
import { InvitationContext } from '@xmtp/xmtp-js/dist/types/src/Invitation';

const useSendMessage = (peerAddress: string) => {
  const { providerState } = useContext(XmtpContext);
  const { client } = providerState || {};

  //Normally returns a Promise<DecodedMessage>
  const sendMessage = async (message: any): Promise<void> => {
    if (!client || !peerAddress) {
      return;
    }
    //Could add a context to define the linked job
    // const context: InvitationContext = {
    //   conversationId: '1',
    //   metadata: { ['job']: 'The job' },
    // };
    // const conversation = await client.conversations.newConversation(peerAddress, context);

    const conversation = await client.conversations.newConversation(peerAddress);
    if (!conversation) return;
    await conversation.send(message);
  };

  return {
    sendMessage,
  };
};

export default useSendMessage;

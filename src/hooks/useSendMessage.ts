import { XmtpContext } from '../context/XmtpContext';
import { useContext } from 'react';

const useSendMessage = (peerAddress: string) => {
  const { providerState } = useContext(XmtpContext);
  const { client } = providerState || {};

  //Normally returns a Promise<DecodedMessage>
  const sendMessage = async (message: any): Promise<void> => {
    if (!client || !peerAddress) {
      return;
    }
    const conversation = await client.conversations.newConversation(peerAddress);
    if (!conversation) return;
    await conversation.send(message);
  };

  return {
    sendMessage,
  };
};

export default useSendMessage;

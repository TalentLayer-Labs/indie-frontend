import { useState, useEffect, useContext } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import { useWalletClient } from 'wagmi';
import { Conversation, Stream } from '@xmtp/xmtp-js';
import { buildChatMessage, CONVERSATION_PREFIX } from '../utils/messaging';

const useStreamConversations = () => {
  const { data: walletClient } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const { publicClientState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<Conversation> | undefined>();

  useEffect(() => {
    if (!publicClientState?.conversations || !publicClientState?.client || !setProviderState)
      return;

    const streamConversations = async () => {
      const newStream = await publicClientState.client?.conversations.stream();
      if (!newStream) return;
      // /!\ in ex was set to 'stream' instead of 'newStream'
      setStream(newStream);
      for await (const conversation of newStream) {
        if (
          conversation.peerAddress !== (await walletClient?.getAddress()) &&
          conversation.context?.conversationId.startsWith(CONVERSATION_PREFIX)
        ) {
          //If a new conversation is detected, we get its messages
          const messages = await conversation.messages();
          const chatMessages = messages.map(msg => {
            return buildChatMessage(msg);
          });
          publicClientState.conversationMessages.set(conversation.peerAddress, chatMessages);
          publicClientState.conversations.set(conversation.peerAddress, conversation);
          setProviderState({
            ...publicClientState,
            conversationMessages: publicClientState.conversationMessages,
            conversations: publicClientState.conversations,
          });
        }
      }
    };

    streamConversations();

    return () => {
      const closeStream = async () => {
        if (!stream) return;
        await stream.return();
      };
      closeStream();
    };
  }, [publicClientState?.conversations]);
};

export default useStreamConversations;

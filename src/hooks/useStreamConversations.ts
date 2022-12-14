import { useState, useEffect, useContext } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import { useSigner } from 'wagmi';
import { Conversation, Stream } from '@xmtp/xmtp-js';

const useStreamConversations = () => {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<Conversation> | undefined>();

  useEffect(() => {
    if (!providerState?.conversations || !providerState?.client || !setProviderState) return;

    const streamConversations = async () => {
      const newStream = await providerState.client?.conversations.stream();
      if (!newStream) return;
      // /!\ in ex was set to 'stream' instead of 'newStream'
      setStream(newStream);
      for await (const conversation of newStream) {
        if (conversation.peerAddress !== (await signer?.getAddress())) {
          const messages = await conversation.messages();
          providerState.conversationMessages.set(conversation.peerAddress, messages);
          providerState.conversations.set(conversation.peerAddress, conversation);
          setProviderState({
            ...providerState,
            conversationMessages: providerState.conversationMessages,
            conversations: providerState.conversations,
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
    // eslint-disable-next-line
  }, [providerState?.conversations]);
};

export default useStreamConversations;

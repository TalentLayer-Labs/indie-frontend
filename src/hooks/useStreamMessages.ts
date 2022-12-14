import { XmtpContext } from '../context/XmtpContext';
import { useContext, useEffect, useState } from 'react';
import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js';
import { useSigner } from 'wagmi';

const useStreamMessages = (peerAddress: string) => {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  // const walletAddress = signer?.getAddress();
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<DecodedMessage>>();
  const [conversation, setConversation] = useState<Conversation>();

  useEffect(() => {
    const getConversation = async () => {
      if (!providerState?.client || !peerAddress) {
        return;
      }
      setConversation(await providerState.client.conversations.newConversation(peerAddress));
    };
    getConversation();
  }, [providerState?.client, peerAddress]);

  useEffect(() => {
    if (!conversation) return;

    const streamMessages = async () => {
      const newStream = await conversation.streamMessages();
      setStream(newStream);
      for await (const msg of newStream) {
        if (providerState && setProviderState) {
          const newMessages =
            providerState.conversationMessages.get(conversation.peerAddress) ?? [];
          newMessages.push(msg);
          const uniqueMessages = [
            ...Array.from(new Map(newMessages.map(item => [item['id'], item])).values()),
          ];
          providerState.conversationMessages.set(conversation.peerAddress, uniqueMessages);
          setProviderState({
            ...providerState,
            conversationMessages: new Map(providerState.conversationMessages),
          });
        }
      }
    };
    streamMessages();

    return () => {
      const closeStream = async () => {
        if (!stream) return;
        await stream.return();
      };
      closeStream();
    };
    // eslint-disable-next-line
  }, [providerState?.conversationMessages,
    // walletAddress,
    conversation,
  ]);
};

export default useStreamMessages;

import { XmtpContext } from '../context/XmtpContext';
import { useContext, useEffect, useState } from 'react';
import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js';
import TalentLayerContext from '../../../context/talentLayer';
import { buildChatMessage, buildConversationId, getLatestMessage } from '../utils/messaging';
import { InvitationContext } from '@xmtp/xmtp-js/dist/types/src/Invitation';

const useStreamMessages = (peerAddress: string, userId: string, peerUserId: string) => {
  const { account } = useContext(TalentLayerContext);
  const walletAddress = account?.address;
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<DecodedMessage>>();
  const [conversation, setConversation] = useState<Conversation>();

  useEffect(() => {
    const getConversation = async () => {
      if (!providerState?.client || !peerAddress) return;
      const conversationId = buildConversationId(peerUserId, userId);
      console.log('conversationId from stream msg', conversationId);

      //Could add a context to define the linked job
      const context: InvitationContext = {
        conversationId: conversationId,
        metadata: { ['domain']: 'TalentLayer' },
      };
      const conversation = await providerState.client.conversations.newConversation(
        peerAddress,
        context,
      );
      setConversation(conversation);
      // setConversation(await providerState.client.conversations.newConversation(peerAddress));
    };
    getConversation();
  }, [providerState?.client, peerAddress]);

  useEffect(() => {
    if (!conversation) return;

    const streamMessages = async () => {
      console.log('streaming messages');
      const newMessageStream = await conversation.streamMessages();
      setStream(newMessageStream);
      for await (const msg of newMessageStream) {
        if (providerState && setProviderState) {
          const newMessages =
            providerState.conversationMessages.get(conversation.peerAddress) ?? [];
          // Default code provided by XMTP. I don't see its utility here so far. I would have put it in the context.
          // const uniqueMessages = [
          //   ...Array.from(new Map(newMessages.map(item => [item['id'], item])).values()),
          // ];
          // Faire un check içi pour ne pas ajouter le message si il existe déjà + build message
          if (getLatestMessage(newMessages)?.messageContent === msg.content) {
            console.log('msgStream - message already exists', msg.content);
            return;
          }
          const incomingChatMessage = buildChatMessage(msg);
          newMessages.push(incomingChatMessage);
          console.log('msgStream - newMessages', newMessages);

          // console.log('msgStream - uniqueMessages', uniqueMessages);
          providerState.conversationMessages.set(conversation.peerAddress, newMessages);
          // providerState.conversationMessages.set(conversation.peerAddress, uniqueMessages);
          setProviderState({
            ...providerState,
            conversationMessages: providerState.conversationMessages,
            // conversationMessages: new Map(providerState.conversationMessages),
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
  }, [providerState?.conversationMessages, walletAddress, conversation]);
};

export default useStreamMessages;

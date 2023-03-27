import { XmtpContext } from '../context/XmtpContext';
import { useContext, useEffect, useState } from 'react';
import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js';
import TalentLayerContext from '../../../context/talentLayer';
import { buildChatMessage, buildConversationId, getLatestMessage } from '../utils/messaging';
import { InvitationContext } from '@xmtp/xmtp-js/dist/types/src/Invitation';

export const NON_EXISTING_XMTP_USER_ERROR_MESSAGE =
  'The user you are trying to contact is not registered on XMTP network.';

const useStreamMessages = (
  peerAddress: string,
  userId: string,
  peerUserId: string,
  setMessageSendingErrorMsg: React.Dispatch<React.SetStateAction<string>>,
) => {
  const { account } = useContext(TalentLayerContext);
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [stream, setStream] = useState<Stream<DecodedMessage>>();
  const [conversation, setConversation] = useState<Conversation>();

  useEffect(() => {
    const getConversation = async () => {
      if (!providerState?.client || !peerAddress) return;
      const conversationId = buildConversationId(peerUserId, userId);

      //Could add a context to define the linked job
      const context: InvitationContext = {
        conversationId: conversationId,
        metadata: { ['domain']: 'TalentLayer' },
      };
      try {
        const conversation = await providerState.client.conversations.newConversation(
          peerAddress,
          context,
        );
        setConversation(conversation);
      } catch (e) {
        setMessageSendingErrorMsg(NON_EXISTING_XMTP_USER_ERROR_MESSAGE);
        console.log('error', e);
      }
    };
    getConversation();

    return () => {
      setMessageSendingErrorMsg('');
    };
  }, [providerState?.client, peerAddress, peerUserId, userId, account]);

  useEffect(() => {
    const streamMessages = async () => {
      if (conversation) {
        const newMessageStream = await conversation.streamMessages();
        setStream(newMessageStream);
        for await (const msg of newMessageStream) {
          if (providerState && setProviderState) {
            const newMessages =
              providerState.conversationMessages.get(conversation.peerAddress) ?? [];
            //If the message is already in the list, don't add it again
            if (getLatestMessage(newMessages)?.messageContent === msg.content) {
              continue;
            }
            const incomingChatMessage = buildChatMessage(msg);
            newMessages.push(incomingChatMessage);

            providerState.conversationMessages.set(conversation.peerAddress, newMessages);

            setProviderState({
              ...providerState,
              loadingConversations: false,
              loadingMessages: false,
              conversationMessages: providerState.conversationMessages,
            });
          }
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
  }, [providerState, conversation, account]);
};

export default useStreamMessages;

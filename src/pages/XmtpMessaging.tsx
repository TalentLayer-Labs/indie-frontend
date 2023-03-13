import {useContext, useState} from 'react';
import {XmtpContext} from '../messaging/xmtp/context/XmtpContext';
import TalentLayerContext from '../context/talentLayer';
import {useSigner} from 'wagmi';
import {watchAccount} from '@wagmi/core';
import ConversationList from '../messaging/xmtp/components/ConversationList';
import CardHeader from '../messaging/xmtp/components/CardHeader';
import MessageList from '../messaging/xmtp/components/MessageList';
import useStreamConversations from '../messaging/xmtp/hooks/useStreamConversations';
import useSendMessage from '../messaging/xmtp/hooks/useSendMessage';
import MessageComposer from '../messaging/xmtp/components/MessageComposer';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import useUserByAddress from '../hooks/useUserByAddress';
import {ChatMessageStatus, XmtpChatMessage} from '../types';
import {NON_EXISTING_XMTP_USER_ERROR_MESSAGE} from '../messaging/xmtp/hooks/useStreamMessages';
import Steps from "../components/Steps";


function XmtpMessaging() {
  const { user } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { providerState, setProviderState } = useContext(XmtpContext);
  const [messageContent, setMessageContent] = useState<string>('');
  const { address: selectedConversationPeerAddress = '' } = useParams();
  const navigate = useNavigate();
  const [sendingPending, setSendingPending] = useState(false);
  const [messageSendingErrorMsg, setMessageSendingErrorMsg] = useState('');

  const { state } = useLocation();

  const { sendMessage } = useSendMessage(
    selectedConversationPeerAddress ? selectedConversationPeerAddress : '',
    user?.id,
  );
  const peerUser = useUserByAddress(selectedConversationPeerAddress);


  watchAccount(() => {
    providerState?.disconnect?.();
    selectedConversationPeerAddress ? navigate(`/messaging/${selectedConversationPeerAddress}`) : navigate(`/messaging`);
  });

  // Listens to new conversations ? ==> Yes, & sets them in "xmtp context". Stream stops "onDestroy"
  useStreamConversations();

  const handleXmtpConnect = async () => {
    if (providerState && providerState.initClient && signer) {
      console.log('Connecting to XMTP...');
      await providerState.initClient(signer);
    }
  };

  const sendNewMessage = async () => {
    if (user && user.address && messageContent && providerState && setProviderState) {
      setSendingPending(true);
      const sentMessage: XmtpChatMessage = {
        from: user.address,
        to: selectedConversationPeerAddress,
        messageContent,
        timestamp: new Date(),
        status: ChatMessageStatus.PENDING,
      };
      console.log('sentMessage', sentMessage);
      console.log('sentMessage status', sentMessage.status);
      const messages = providerState.conversationMessages.get(selectedConversationPeerAddress);
      if (messages) {
        // If Last message in error, remove it & try to resend
        if (messageSendingErrorMsg) {
          console.log('last message in error');
          messages.pop();
          setMessageSendingErrorMsg('');
        }
        messages.push(sentMessage);
      } else {
        // If no messages, create new ChatMessage array
        console.log("New Conversation")
        providerState.conversationMessages.set(selectedConversationPeerAddress, [sentMessage]);
      }
      console.log('Messages updated', messages);
      // setProviderState(providerState);

      try {
        //Send message
        // throw new Error('Test error');
        setProviderState({...providerState, conversationMessages: providerState.conversationMessages});
        const response = await sendMessage(messageContent);
        console.log('Message sent', response);
        // Update message status & timestamp
        sentMessage.status = ChatMessageStatus.SENT;
        sentMessage.timestamp = response.sent;
        messages?.pop();
        messages?.push(sentMessage);
        // setProviderState(providerState);
        setMessageContent('');
      } catch (error) {
        setMessageSendingErrorMsg(
          'An error occurred while sending the message. Please try again later.',
        );
        // If message in error, update last message' status to ERROR
        sentMessage.status = ChatMessageStatus.ERROR;
        messages?.pop();
        messages?.push(sentMessage);
        // setProviderState(providerState);
        console.error(error);
      } finally {
        setProviderState({...providerState, conversationMessages: providerState.conversationMessages})
        setSendingPending(false);
        // setMessageContent('');
      }
    }
  };
  /*TODO: Les msg ne chargent pas quand TheGraph est down car on a une condition sur le handle
   Du coup le listener ne s'active pas car il est dans "messageList"
   */

  return (<div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Indie <span className='text-indigo-600'>Chat </span>
      </p>

      <Steps targetTitle={'Access messaging'} />

      {!providerState?.client && user && (<button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => handleXmtpConnect()}>
          Connect to XMTP
        </button>)}
      {providerState?.client && (// <div className='border-2 rounded-md'>
        <>
          <CardHeader peerAddress={selectedConversationPeerAddress}/>
          <div className='flex flex-row'>
            <div className='basis-1/4 h-[calc(100vh-16rem)] flex-no-wrap flex-none overflow-y-auto border-r-2'>
              <ConversationList
                conversationMessages={providerState.conversationMessages}
                selectedConversationPeerAddress={selectedConversationPeerAddress}
                conversationsLoading={providerState.loadingConversations}
              />
            </div>
            {providerState?.client && selectedConversationPeerAddress && user?.id && peerUser?.id &&
              (<div className='basis-3/4 w-full pl-5 flex flex-col justify-between h-[calc(100vh-16rem)]'>
                  <div className='overflow-y-auto'>
                    <MessageList
                      conversationMessages={providerState.conversationMessages.get(selectedConversationPeerAddress) ?? []}
                      selectedConversationPeerAddress={selectedConversationPeerAddress}
                      userId={user?.id}
                      peerUserId={peerUser?.id as string}
                      messagesLoading={providerState.loadingMessages}
                      sendingPending={sendingPending}
                      setMessageSendingErrorMsg={setMessageSendingErrorMsg}
                    />
                  </div>
                  {(!providerState.loadingMessages || messageSendingErrorMsg) && <MessageComposer
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    sendNewMessage={sendNewMessage}
                    sendingPending={sendingPending}
                    peerUserExistsOnXMTP={(messageSendingErrorMsg !== NON_EXISTING_XMTP_USER_ERROR_MESSAGE)}
                    peerUserExistsOnTalentLayer={(!!peerUser)}
                  />}
                </div>)}
          </div>
          {messageSendingErrorMsg && (<div className={'text-center'}>
              <p className={'text-red-400 ml-1'}>{messageSendingErrorMsg}</p>
            </div>)}
          {selectedConversationPeerAddress && !peerUser && (<div className={'text-center'}>
              <p className={'text-red-400 ml-1'}>User is not registered with TalentLayer</p>
            </div>)}
        </>)}
    </div>);
}

export default XmtpMessaging;

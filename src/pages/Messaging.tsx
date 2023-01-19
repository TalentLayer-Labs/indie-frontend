import { useContext, useState } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { useNavigate, useParams } from 'react-router-dom';
import { chat as chatApi } from '@pushprotocol/restapi';
import CardHeader from '../messaging/components/CardHeader';
import MessageComposer from '../messaging/components/MessageComposer';
import MessageList from '../messaging/components/MessageList';
import ConversationList from '../messaging/components/ConversationList';
import PushContext from '../messaging/context/pushUser';
import { walletToPCAIP10 } from '@pushprotocol/restapi/src/lib/helpers/address';
import { watchAccount } from '@wagmi/core';
import { ChatMessage, ChatMessageStatus, ConversationDisplayType, PushMessage } from '../types';
import Steps from '../components/Steps';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { buildConversationMessage } from '../messaging/utils/messaging';

function Messaging() {
  const { account, user } = useContext(TalentLayerContext);
  const {
    pushUser,
    initPush,
    conversations,
    conversationMessages,
    requests,
    privateKey,
    disconnect,
    conversationsLoaded,
    messagesLoaded,
    setConversations,
    setConversationMessages,
    getOneConversationMessages,
  } = useContext(PushContext);
  const {
    address: selectedConversationPeerAddress = '',
    conversationType = ConversationDisplayType.CONVERSATION,
  } = useParams();
  const navigate = useNavigate();
  const [messageContent, setMessageContent] = useState('');
  const [sendingPending, setSendingPending] = useState(false);
  const [messageSendingErrorMsg, setMessageSendingErrorMsg] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);

  if (selectedConversationPeerAddress && conversations && !pageLoaded) {
    console.log('here');
    const conversation = conversations?.find(
      c => pCAIP10ToWallet(c.toCAIP10) === selectedConversationPeerAddress,
    );
    if (conversation) {
      try {
        getOneConversationMessages(conversation);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoaded(true);
      }
    }
  }

  const handleDecryptConversations = async () => {
    try {
      if (initPush && user?.address) {
        await initPush(user?.address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //TODO lighten conversation data content
  const handleDisplayChange = (conversationDisplayType: ConversationDisplayType) => {
    conversationDisplayType === ConversationDisplayType.REQUEST
      ? navigate('/messaging/requests')
      : navigate('/messaging/conversations');
  };

  const sendNewMessage = async () => {
    if (
      pushUser?.wallets &&
      user &&
      messageContent &&
      privateKey &&
      setConversations &&
      conversationMessages &&
      setConversationMessages
    ) {
      setSendingPending(true);

      const receiverAddressCAIP10 = walletToPCAIP10(selectedConversationPeerAddress);

      const refactoredMessage: ChatMessage = {
        from: user.address,
        to: selectedConversationPeerAddress,
        messageContent: messageContent,
        timestamp: new Date().getTime(),
        status: ChatMessageStatus.PENDING,
      };

      const messages = conversationMessages.get(receiverAddressCAIP10);
      if (messages) {
        // If Last message in error, remove it & try to resend
        if (messageSendingErrorMsg) {
          messages.pop();
          setMessageSendingErrorMsg('');
        }
        messages.push(refactoredMessage);
      } else {
        // If no messages, create new ChatMessage array
        conversationMessages.set(receiverAddressCAIP10, [refactoredMessage]);
      }
      console.log('Messages updated', messages);
      setConversationMessages(conversationMessages);

      try {
        //Send message
        const sentMessage: PushMessage = await chatApi.send({
          account: pushUser?.wallets,
          messageContent,
          receiverAddress: receiverAddressCAIP10,
          pgpPrivateKey: privateKey,
          apiKey: import.meta.env.VITE_PUSH_API_KEY,
        });
        console.log('sentMessage', sentMessage);
        //Replace encrypted content by decrypted content
        sentMessage.messageContent = messageContent;

        //If success, update messages with SENT status & Replace the last message in arrays
        refactoredMessage.status = ChatMessageStatus.SENT;
        messages?.pop();
        messages?.push(refactoredMessage);

        //Update Conversations if success
        const refactoredConversation = buildConversationMessage(sentMessage);
        console.log('Refactored Message', refactoredConversation);
        conversations?.map((c, index) => {
          if (c.toCAIP10 === refactoredConversation.toCAIP10) {
            conversations[index] = refactoredConversation;
          }
        });
        setConversations(conversations);

        setMessageContent('');
      } catch (e: any) {
        setMessageSendingErrorMsg(
          'An error occurred while sending the message. Please try again later.',
        );
        // If message in error, update last message' status to ERROR
        refactoredMessage.status = ChatMessageStatus.ERROR;
        messages?.pop();
        messages?.push(refactoredMessage);
        console.error(e);
      } finally {
        setSendingPending(false);
      }
    }
  };
  watchAccount(() => {
    if (disconnect && initPush && user?.address) {
      const changeUser = async () => {
        disconnect();
        //TODO not working: "The requested account and/or method has not been authorized by the user."
        // await initPush(user?.address);
        navigate(`/messaging`);
      };
      changeUser();
    }
  });

  return (
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0 h-full'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Indie <span className='text-indigo-600'>Chat </span>
      </p>

      <Steps targetTitle={'Access messaging'} />

      {account?.isConnected && user && !conversations && (
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => handleDecryptConversations()}>
          Connect to Push
        </button>
      )}
      {conversations && requests && (
        <>
          <CardHeader
            peerAddress={selectedConversationPeerAddress}
            handleDisplayChange={handleDisplayChange}
          />
          <div className='flex flex-row'>
            {conversationType && (
              <div className='basis-1/4 h-[calc(100vh-16rem)] flex-no-wrap flex-none overflow-y-auto border-r-2'>
                <ConversationList
                  conversations={
                    conversationType == ConversationDisplayType.CONVERSATION
                      ? conversations
                      : requests
                  }
                  conversationDisplayType={conversationType}
                  selectedConversationPeerAddress={selectedConversationPeerAddress}
                  conversationsLoaded={conversationsLoaded}
                  setPageLoaded={setPageLoaded}
                />
              </div>
            )}

            <div className='basis-3/4 w-full pl-5 flex flex-col justify-between h-[calc(100vh-16rem)]'>
              <div className='overflow-y-auto'>
                <MessageList
                  conversationMessages={
                    conversationMessages?.get(walletToPCAIP10(selectedConversationPeerAddress)) ??
                    []
                  }
                  messagesLoaded={messagesLoaded}
                  selectedConversationPeerAddress={!!selectedConversationPeerAddress}
                />
              </div>

              <MessageComposer
                messageContent={messageContent}
                setMessageContent={setMessageContent}
                sendNewMessage={sendNewMessage}
                sendingPending={sendingPending}
                messageSendingErrorMsg={messageSendingErrorMsg}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Messaging;

import { useContext, useEffect, useRef, useState } from 'react';
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
import { ConversationDisplayType } from '../types';
import Steps from '../components/Steps';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';

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
    getConversations,
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
  const bottomRef = useRef<HTMLDivElement>(null);

  if (selectedConversationPeerAddress && conversations && !pageLoaded) {
    try {
      const conversation = conversations?.find(
        c => pCAIP10ToWallet(c.toCAIP10) === selectedConversationPeerAddress,
      );
      if (conversation) {
        getOneConversationMessages(conversation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPageLoaded(true);
    }
  }

  // Not working
  // useEffect(() => {
  //   console.log('pageLoaded', pageLoaded);
  // }, [pageLoaded]);

  const handleDecryptConversations = async () => {
    try {
      if (initPush && user?.address) {
        await initPush(user?.address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //TODO add state in message "isDelivered" comme IOS
  //TODO lighten conversation data content
  //TODO Update Listener
  //TODO Check compare timestamp for state update
  const handleDisplayChange = (conversationDisplayType: ConversationDisplayType) => {
    conversationDisplayType === ConversationDisplayType.REQUEST
      ? navigate('/messaging/requests')
      : navigate('/messaging/conversations');
  };

  const sendNewMessage = async () => {
    try {
      if (pushUser?.wallets && messageContent && privateKey && getConversations) {
        //Send message
        setSendingPending(true);
        setMessageSendingErrorMsg('');
        await chatApi.send({
          account: pushUser?.wallets,
          messageContent,
          receiverAddress: walletToPCAIP10(selectedConversationPeerAddress),
          pgpPrivateKey: privateKey,
          apiKey: import.meta.env.VITE_PUSH_API_KEY,
        });
        await getConversations();
        setMessageContent('');
        setSendingPending(false);
      }
    } catch (e: any) {
      setSendingPending(false);
      setMessageSendingErrorMsg(
        'An error occurred while sending the message. Please try again later.',
      );
      console.error(e);
    }
  };

  watchAccount(() => {
    if (disconnect && initPush && user?.address) {
      const changeUser = async () => {
        disconnect();
        // TODO not working, maybe with a context listener on Signer change
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
                <div ref={bottomRef}></div>
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
                  pageLoaded={pageLoaded}
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

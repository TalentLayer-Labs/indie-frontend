import { useContext, useState } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { useNavigate, useParams } from 'react-router-dom';
import useUserByAddress from '../hooks/useUserByAddress';
import { chat as chatApi, IMessageIPFS } from '@pushprotocol/restapi';
import CardHeader from '../messaging/components/CardHeader';
import MessageComposer from '../messaging/components/MessageComposer';
import MessageList from '../messaging/components/MessageList';
import ConversationList from '../messaging/components/ConversationList';
import PushContext from '../messaging/context/pushUser';
import { walletToPCAIP10 } from '@pushprotocol/restapi/src/lib/helpers/address';
import { watchAccount } from '@wagmi/core';
import { ConversationDisplayType } from '../types';
import { decryptMessage } from '@pushprotocol/restapi/src/lib/helpers';
import Steps from '../components/Steps';
import useConversationListener from '../messaging/hooks/useConversationListener';

function Messaging() {
  const { account, user } = useContext(TalentLayerContext);
  const {
    pushUser,
    initPush,
    conversations,
    conversationMessages,
    updateAfterSend,
    setConversationMessages,
    requests,
    privateKey,
    disconnect,
  } = useContext(PushContext);
  const {
    address: selectedConversationPeerAddress = '',
    conversationType = ConversationDisplayType.CONVERSATION,
  } = useParams();
  const navigate = useNavigate();
  // const peerUser = useUserByAddress(selectedConversationPeerAddress);
  const [messageContent, setMessageContent] = useState('');
  const [activeConversation, setActiveConversation] = useState<IMessageIPFS[]>();
  const [isConvSelected, setIsConvSelected] = useState(false);

  useConversationListener();

  const handleDecryptConversations = async () => {
    try {
      if (initPush && user?.address) {
        await initPush(user?.address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisplayChange = (conversationDisplayType: ConversationDisplayType) => {
    conversationDisplayType === ConversationDisplayType.REQUEST
      ? navigate('/messaging/requests')
      : navigate('/messaging/conversations');
    setIsConvSelected(false);
  };

  const sendNewMessage = async () => {
    try {
      if (pushUser?.wallets && messageContent && privateKey && updateAfterSend) {
        //Send message
        const response: IMessageIPFS = await chatApi.send({
          account: pushUser?.wallets,
          messageContent,
          receiverAddress: walletToPCAIP10(selectedConversationPeerAddress),
          pgpPrivateKey: privateKey,
          // env: import.meta.env.VITE_PUSH_ENV,
          apiKey: import.meta.env.VITE_PUSH_API_KEY,
        });
        await updateAfterSend(selectedConversationPeerAddress, response);
        setMessageContent('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  watchAccount(() => {
    if (disconnect && initPush && user?.address) {
      const changeUser = async () => {
        disconnect();
        // await initPush(user?.address);
        navigate(`/messaging`);
      };
      changeUser();
    }
  });

  return (
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
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
        // <div className='border-2 rounded-md'>
        <>
          <CardHeader
            peerAddress={selectedConversationPeerAddress}
            handleDisplayChange={handleDisplayChange}
          />
          <div className='flex flex-row'>
            {conversationType && (
              <div className='basis-1/4 border-r-2'>
                <ConversationList
                  conversations={
                    conversationType == ConversationDisplayType.CONVERSATION
                      ? conversations
                      : requests
                  }
                  conversationDisplayType={conversationType}
                />
              </div>
            )}
            {selectedConversationPeerAddress && conversationMessages && (
              <div className='basis-3/4 w-full px-5 flex flex-col justify-between'>
                <MessageList
                  conversationMessages={
                    conversationMessages.get(walletToPCAIP10(selectedConversationPeerAddress)) ?? []
                  }
                />
                <MessageComposer
                  messageContent={messageContent}
                  setMessageContent={setMessageContent}
                  sendNewMessage={sendNewMessage}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Messaging;

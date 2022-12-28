import { useContext, useEffect, useState } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { useSigner } from 'wagmi';
import { watchAccount } from '@wagmi/core';
import { useNavigate, useParams } from 'react-router-dom';
import useUserByAddress from '../hooks/useUserByAddress';
import { user as userApi, chat as chatApi, ChatOptionsType, IUser } from '@pushprotocol/restapi';
import { ChatsOptionsType } from '@pushprotocol/restapi/src/lib/chat';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import CardHeader from '../messaging/components/CardHeader';
import MessageComposer from '../messaging/components/MessageComposer';
import MessageList from '../messaging/components/MessageList';
import ConversationList from '../messaging/components/ConversationList';
import PushContext from '../messaging/context/pushUser';
import { walletToPCAIP10 } from '@pushprotocol/restapi/src/lib/helpers/address';

//TODO: Implement crreateUserIfNecessary: helpers/chat.ts

function Messaging() {
  const { user } = useContext(TalentLayerContext);
  const { pushUser, initPush, conversations, conversationMessages, privateKey } =
    useContext(PushContext);
  const { address: selectedConversationPeerAddress = '' } = useParams();
  const navigate = useNavigate();
  const peerUser = useUserByAddress(selectedConversationPeerAddress);
  const [messageContent, setMessageContent] = useState('');

  //TODO: Add redirect to sign in if not TL user

  const handleDecryptConversations = async () => {
    try {
      if (initPush && user?.address) {
        await initPush(user?.address);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendNewMessage = async () => {
    try {
      if (pushUser?.wallets && messageContent && privateKey) {
        // const chatOptions: ChatOptionsType = {
        //   //TODO consider using getConnectedUser from chat/helper/users
        //   connectedUser: { ...pushUser, privateKey },
        //   account: pushUser?.wallets,
        //   messageContent,
        //   receiverAddress: walletToPCAIP10(selectedConversationPeerAddress),
        //   pgpPrivateKey: privateKey,
        // };
        // await chatApi.send(chatOptions);
        await chatApi.send({
          account: pushUser?.wallets,
          messageContent,
          receiverAddress: walletToPCAIP10(selectedConversationPeerAddress),
          pgpPrivateKey: privateKey,
        });
        setMessageContent('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // watchAccount(() => {
  //   navigate(`/messaging`);
  // });

  return (
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Indie <span className='text-indigo-600'>Chat </span>
      </p>

      {user && !conversations && (
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => handleDecryptConversations()}>
          Connect to Push
        </button>
      )}
      {conversations && (
        // <div className='border-2 rounded-md'>
        <>
          <CardHeader peerAddress={selectedConversationPeerAddress} />
          <div className='flex flex-row'>
            <div className='basis-1/4 border-r-2'>
              <ConversationList
                conversations={conversations}
                selectedConversationPeerAddress={selectedConversationPeerAddress}
                peerAddress={peerUser?.address ? peerUser.address : ''}
                // setSelectedConversationPeerAddress={setSelectedConversationPeerAddress}
              />
            </div>
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

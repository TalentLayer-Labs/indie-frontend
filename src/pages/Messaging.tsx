import { useContext, useState } from 'react';
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

//TODO: Finalize UX
//TODO: Integrate "New message" + update when new conversation created
//TODO: Register user to XMTP when profile being created ? When proposal + job being created + button if want before?

function Messaging() {
  const { user } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { address: selectedConversationPeerAddress = '' } = useParams();
  const navigate = useNavigate();
  const peerUser = useUserByAddress(selectedConversationPeerAddress);
  const [pushUser, setPushUser] = useState<IUser>();
  const [conversations, setConversations] = useState<Message[]>();
  const [messages, setMessages] = useState<IMessageIPFS[]>();

  //TODO: Add redirect to sign in if not TL user

  const options: ChatsOptionsType = {
    //TODO plus obligé d'utiliser le contexte, on peut utiliser les datas de userApi.get
    account: user?.address,
  };

  const handleDecryptConversations = async () => {
    const pushUserData = await userApi.get({ account: user?.address as string });
    setPushUser(pushUserData);
    // console.log('userData: ', pushUserData);
    // console.log('pCAIP10ToWallet(userData.wallets): ', pCAIP10ToWallet(pushUserData.wallets));
    const privateKey = await chatApi.decryptWithWalletRPCMethod(
      pushUserData.encryptedPrivateKey,
      pCAIP10ToWallet(pushUserData.wallets),
    );
    // console.log('privateKey', privateKey);

    // const ChatsOptions: ChatsOptionsType = {
    //   account: user?.address as string,
    //   privateKey,
    // };

    const msgs = await chatApi.chats({
      pgpPrivateKey: privateKey,
      account: user?.address as string,
    });
    console.log('msgs', msgs);
    setConversations(msgs);
  };

  watchAccount(() => {
    navigate(`/messaging`);
  });

  return (
    // <>
    //   <p>Hello</p>
    //   <button onClick={() => getData()}>GetData</button>
    // </>
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Indie <span className='text-indigo-600'>Chat </span>
      </p>

      {user && !pushUser && (
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
            {/*{providerState?.client && selectedConversationPeerAddress && user?.id && peerUser?.id && (*/}
            {/*  <div className='basis-3/4 w-full px-5 flex flex-col justify-between'>*/}
            {/*    <MessageList*/}
            {/*      conversationMessages={*/}
            {/*        providerState.conversationMessages.get(selectedConversationPeerAddress) ?? []*/}
            {/*      }*/}
            {/*      selectedConversationPeerAddress={selectedConversationPeerAddress}*/}
            {/*      userId={user?.id}*/}
            {/*      peerUserId={peerUser?.id}*/}
            {/*    />*/}
            {/*    <MessageComposer*/}
            {/*      messageContent={messageContent}*/}
            {/*      setMessageContent={setMessageContent}*/}
            {/*      sendNewMessage={sendNewMessage}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </>
      )}
    </div>
  );
}

export default Messaging;

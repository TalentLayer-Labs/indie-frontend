import { useContext, useState } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { useSigner } from 'wagmi';
import { watchAccount } from '@wagmi/core';
import { useNavigate, useParams } from 'react-router-dom';
import useUserByAddress from '../hooks/useUserByAddress';
import { user, chat, ChatOptionsType } from '@pushprotocol/restapi';
import { ChatsOptionsType } from '@pushprotocol/restapi/src/lib/chat';

//TODO: Finalize UX
//TODO: Integrate "New message" + update when new conversation created
//TODO: Register user to XMTP when profile being created ? When proposal + job being created + button if want before?

function Messaging() {
  const { user } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { address: selectedConversationPeerAddress = '' } = useParams();
  const navigate = useNavigate();
  const peerUser = useUserByAddress(selectedConversationPeerAddress);

  const options: ChatsOptionsType = {
    account: '0x9F89836C22f250595DEA30327af026bA1c029f28',
  };

  const getData = async () => {
    console.log('getData', user);
    const msgs = await chat.chats(options);
    console.log('msgs', msgs);
  };

  watchAccount(() => {
    navigate(`/messaging`);
  });

  return (
    <>
      <p>Hello</p>
      <button onClick={() => getData()}>GetData</button>
    </>
    // <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
    //   <p className='text-5xl font-medium tracking-wider mb-8'>
    //     Indie <span className='text-indigo-600'>Chat </span>
    //   </p>
    //
    //   {!providerState?.client && (
    //     <button
    //       type='submit'
    //       className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
    //       onClick={() => handleXmtpConnect()}>
    //       Connect to XMTP
    //     </button>
    //   )}
    //   {providerState?.client && !providerState?.loadingConversations && (
    //     // <div className='border-2 rounded-md'>
    //     <>
    //       <CardHeader peerAddress={selectedConversationPeerAddress} />
    //       <div className='flex flex-row'>
    //         <div className='basis-1/4 border-r-2'>
    //           <ConversationList
    //             conversationMessages={providerState.conversationMessages}
    //             selectedConversationPeerAddress={selectedConversationPeerAddress}
    //             peerAddress={peerUser?.address ? peerUser.address : ''}
    //             // setSelectedConversationPeerAddress={setSelectedConversationPeerAddress}
    //           />
    //         </div>
    //         {providerState?.client && selectedConversationPeerAddress && user?.id && peerUser?.id && (
    //           <div className='basis-3/4 w-full px-5 flex flex-col justify-between'>
    //             <MessageList
    //               conversationMessages={
    //                 providerState.conversationMessages.get(selectedConversationPeerAddress) ?? []
    //               }
    //               selectedConversationPeerAddress={selectedConversationPeerAddress}
    //               userId={user?.id}
    //               peerUserId={peerUser?.id}
    //             />
    //             <MessageComposer
    //               messageContent={messageContent}
    //               setMessageContent={setMessageContent}
    //               sendNewMessage={sendNewMessage}
    //             />
    //           </div>
    //         )}
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}

export default Messaging;

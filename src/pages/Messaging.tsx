import { useContext, useState } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import TalentLayerContext from '../context/talentLayer';
import { useSigner } from 'wagmi';
import { watchAccount } from '@wagmi/core';
import ConversationList from '../components/ConversationList';
import CardHeader from '../components/CardHeader';
import MessageList from '../components/MessageList';
import useStreamConversations from '../hooks/useStreamConversations';
import useSendMessage from '../hooks/useSendMessage';
import MessageComposer from '../components/MessageComposer';
import { useNavigate, useParams } from 'react-router-dom';
import useUserByAddress from '../hooks/useUserByAddress';

//TODO: Finalize UX
//TODO: Integrate "New message" + update when new conversation created
//TODO: Register user to XMTP when profile being created

function Messaging() {
  const { user } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { providerState } = useContext(XmtpContext);
  const [messageContent, setMessageContent] = useState<string>('');
  const { address: selectedConversationPeerAddress = '' } = useParams();
  const navigate = useNavigate();
  // Apparently the context handles this as a sigher change, and disconnects the user
  // if (selectedConversationPeerAddress === user?.address) navigate('/messaging');
  const { sendMessage } = useSendMessage(
    selectedConversationPeerAddress ? selectedConversationPeerAddress : '',
    user?.id,
  );
  const peerUser = useUserByAddress(selectedConversationPeerAddress);

  watchAccount(() => {
    providerState?.disconnect?.();
    navigate(`/messaging`);
  });

  // Listens to new conversations ? ==> Yes, & sets them in "xmtp context". Stream stops "onDestroy"
  useStreamConversations();

  // if (!providerState) return;

  const handleXmtpConnect = async () => {
    if (providerState && providerState.initClient && signer) {
      await providerState.initClient(signer);
    }
  };

  const sendNewMessage = () => {
    sendMessage(messageContent);
    setMessageContent('');
  };

  return (
    <div className='mx-auto text-gray-900 sm:px-4 lg:px-0'>
      <p className='text-5xl font-medium tracking-wider mb-8'>
        Indie <span className='text-indigo-600'>Chat </span>
      </p>

      {!providerState?.client && (
        <button
          type='submit'
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => handleXmtpConnect()}>
          Connect to XMTP
        </button>
      )}
      {providerState?.client && !providerState?.loadingConversations && (
        // <div className='border-2 rounded-md'>
        <>
          <CardHeader peerAddress={selectedConversationPeerAddress} />
          <div className='flex flex-row'>
            <div className='basis-1/4 border-r-2'>
              <ConversationList
                conversationMessages={providerState.conversationMessages}
                selectedConversationPeerAddress={selectedConversationPeerAddress}
                peerAddress={peerUser?.address ? peerUser.address : ''}
                // setSelectedConversationPeerAddress={setSelectedConversationPeerAddress}
              />
            </div>
            {providerState?.client && selectedConversationPeerAddress && user?.id && peerUser?.id && (
              <div className='basis-3/4 w-full px-5 flex flex-col justify-between'>
                <MessageList
                  conversationMessages={
                    providerState.conversationMessages.get(selectedConversationPeerAddress) ?? []
                  }
                  selectedConversationPeerAddress={selectedConversationPeerAddress}
                  userId={user?.id}
                  peerUserId={peerUser?.id}
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

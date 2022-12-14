import useUsers from '../hooks/useUsers';
import MessageCard from '../components/MessageCard';
import ConversationCard from '../components/ConversationCard';
import { useContext, useState } from 'react';
import { XmtpContext } from '../context/XmtpContext';
import SubmitButton from '../components/Form/SubmitButton';
import TalentLayerContext from '../context/talentLayer';
import { useSigner } from 'wagmi';
import ConversationList from '../components/ConversationList';
import CardHeader from '../components/CardHeader';
import MessageList from '../components/MessageList';
import useStreamConversations from '../hooks/useStreamConversations';

//TODO: Finalize listeners
//TODO: Finalize UX
//TODO: Integrate "New message" + update when new conversation created
//TODO: Register user to XMTP when profile being created

function Messaging() {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  // @Romain: I didn't fully understand how I made the context work
  const { providerState } = useContext(XmtpContext);
  const { users } = useUsers();
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [isNewMessage, setIsNewMessage] = useState(false);

  // Listens to new conversations ? ==> Yes, & sets them in "xmtp context". Stream stops "onDestroy"
  useStreamConversations();

  // if (!providerState) return;

  const handleXmtpConnect = async () => {
    if (providerState && providerState.initClient && signer) {
      console.log('providerState.conversationMessages', providerState.conversationMessages);
      console.log('providerState.conversations', providerState.conversations);
      //Conversations ===> Data sur les convers
      //conversationMessages ===> Messages Map address / Array Objets(messages)
      await providerState.initClient(signer);
    }
  };

  return (
    <div className='max-w-7xl mx-auto text-gray-900 sm:px-4 lg:px-0'>
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
      {providerState?.client && (
        // <div className='border-2 rounded-md'>
        <>
          <CardHeader setIsNewMsg={setIsNewMessage} />
          <div className='flex flex-row'>
            <div className='basis-1/4'>
              <ConversationList
                conversationMessages={providerState.conversationMessages}
                setSelectedConversation={setSelectedConversation}
              />
            </div>
            {providerState?.client && selectedConversation.length > 0 && (
              <div className='basis-3/4'>
                <MessageList
                  isNewMsg={isNewMessage}
                  conversationMessages={
                    providerState.conversationMessages.get(selectedConversation) ?? []
                  }
                  selectedConversationPeerAddress={selectedConversation}
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

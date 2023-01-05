import { useEffect, useContext } from 'react';
import PushContext from '../context/pushUser';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';

const useConversationListener = () => {
  const { conversations, setConversations, pushUser, privateKey } = useContext(PushContext);

  useEffect(() => {
    let conversationFetcher: NodeJS.Timer;
    const fetchData = async () => {
      if (setConversations && pushUser) {
        try {
          conversationFetcher = setInterval(async () => {
            await getConversations();
          }, 5000);
        } catch (err: any) {
          console.error(err);
        }
      }
    };
    fetchData();

    return () => {
      if (conversationFetcher) {
        clearInterval(conversationFetcher);
      }
    };
  }, [conversations]);

  const getConversations = async (): Promise<void> => {
    if (pushUser && privateKey && setConversations) {
      const newConversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      const stateConversations = JSON.parse(JSON.stringify(conversations));
      const hasConversationsChanged =
        JSON.stringify(newConversations) !== JSON.stringify(stateConversations);
      if (hasConversationsChanged) {
        setConversations(newConversations);
      }
    }
  };
};

export default useConversationListener;

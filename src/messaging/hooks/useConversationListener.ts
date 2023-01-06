import { useEffect, useContext } from 'react';
import PushContext from '../context/pushUser';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';

const useConversationListener = () => {
  const {
    conversations,
    requests,
    setConversations,
    getConversations,
    getRequests,
    pushUser,
    privateKey,
  } = useContext(PushContext);

  useEffect(() => {
    let conversationFetcher: NodeJS.Timer;
    const fetchData = async () => {
      if (setConversations && pushUser) {
        try {
          conversationFetcher = setInterval(async () => {
            console.log('tick');
            await checkStateUpdate();
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

  const checkStateUpdate = async (): Promise<void> => {
    if (pushUser && privateKey && setConversations && getConversations && getRequests) {
      // Call the API to get the latest conversations & check it against the state
      const newConversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      const stateConversations = JSON.parse(JSON.stringify(conversations));
      const hasConversationsChanged =
        JSON.stringify(newConversations) != JSON.stringify(stateConversations);
      // console.log('newConv', JSON.stringify(newConversations));
      // console.log('stateConv', JSON.stringify(stateConversations));
      // console.log('hasConversationsChanged', hasConversationsChanged);

      // Call the API to get the latest requests & check it against the state
      const latestRequests = await chatApi.requests({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      const stateRequests = JSON.parse(JSON.stringify(requests));
      const hasRequestsChanged = JSON.stringify(latestRequests) !== JSON.stringify(stateRequests);

      if (hasConversationsChanged) {
        console.log('conversations changed');
        await getConversations();
      }
      if (hasRequestsChanged) {
        console.log('Requests changed');
        await getRequests();
      }
    }
  };
};

export default useConversationListener;

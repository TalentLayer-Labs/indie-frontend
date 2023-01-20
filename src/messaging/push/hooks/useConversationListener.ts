import { useEffect, useContext } from 'react';
import PushContext from '../context/pushUser';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';

const useConversationListener = () => {
  const {
    conversations,
    requests,
    setConversations,
    getConversations,
    getRequests,
    getOneConversationMessages,
    pushUser,
    privateKey,
  } = useContext(PushContext);

  useEffect(() => {
    let conversationFetcher: NodeJS.Timer;
    const fetchData = async () => {
      if (setConversations && pushUser) {
        try {
          conversationFetcher = setInterval(async () => {
            console.log('tick', conversationFetcher);
            await checkStateUpdate();
          }, 5000);
        } catch (err: any) {
          clearInterval(conversationFetcher);
          console.error(err);
        }
      }
    };
    fetchData();

    return () => {
      if (conversationFetcher) {
        console.log('clearing interval', conversationFetcher);
        clearInterval(conversationFetcher);
      }
    };
  }, [conversations]);

  const checkStateUpdate = async (): Promise<void> => {
    if (pushUser && privateKey && setConversations && getConversations && getRequests) {
      console.log('checking state update ');
      // Call the API to get the latest conversations & check it against the state
      const newConversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });

      newConversations.forEach((newConversation: Message) => {
        const existingConversation = conversations?.find((conversation: Message) => {
          return conversation.toCAIP10 === newConversation.toCAIP10;
        });
        if (
          existingConversation?.toCAIP10 === 'eip155:0xEc0Dc36A8E593DBf7ab012305A34ee34aDEe28ac'
        ) {
          console.log('existingConversation', existingConversation?.toCAIP10);
          console.log('bool', existingConversation?.timestamp !== newConversation.timestamp);
        }
        if (existingConversation && existingConversation.timestamp !== newConversation.timestamp) {
          console.log('updating conversation', newConversation);
          getOneConversationMessages(newConversation);
        }
      });

      // // Call the API to get the latest requests & check it against the state
      const latestRequests = await chatApi.requests({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });

      latestRequests.forEach((newRequest: Message) => {
        const existingRequest = requests?.find((request: Message) => {
          return request.toCAIP10 === newRequest.toCAIP10;
        });
        if (
          (existingRequest && existingRequest.timestamp !== newRequest.timestamp) ||
          !existingRequest
        ) {
          console.log('updating requests', newRequest);
          getRequests();
        }
      });
    }
  };
};

export default useConversationListener;

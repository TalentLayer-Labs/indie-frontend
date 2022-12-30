import { useEffect, useState, FC, useContext } from 'react';
import PushContext from '../context/pushUser';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';

const useConversationListener = () => {
  const {
    conversations,
    setConversations,
    conversationMessages,
    setConversationMessages,
    pushUser,
    privateKey,
  } = useContext(PushContext);

  useEffect(() => {
    console.log('useConversationListener: ', conversations);
    let conversationFetcher: NodeJS.Timer;
    const fetchData = async () => {
      if (
        conversations &&
        setConversations &&
        conversationMessages &&
        setConversationMessages &&
        pushUser
      ) {
        try {
          conversationFetcher = setInterval(async () => {
            await getConversations();
            console.log('tick', Date.now());
          }, 2000);
          console.log('dataStreamId: ', conversationFetcher);
        } catch (err: any) {
          console.error(err);
        }
      }
    };
    fetchData();

    return () => {
      if (conversationFetcher) {
        console.log('useConversationListener: cleanup', conversationFetcher);
        clearInterval(conversationFetcher);
      }
    };
  }, []);

  const getConversations = async (): Promise<void> => {
    if (pushUser && privateKey && setConversations) {
      const newConversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      setConversations(newConversations);
      console.log('newConversations', newConversations);
    }
  };
};

export default useConversationListener;

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

  // useEffect(() => {
  //   console.log('useConversationListener: conversations updated', conversations);
  // }, [conversations]);

  useEffect(() => {
    console.log('useConversationListener');
    let conversationFetcher: NodeJS.Timer;
    const fetchData = async () => {
      if (
        //TODO Why this first check ?
        // conversations &&
        setConversations &&
        conversationMessages &&
        setConversationMessages &&
        pushUser
      ) {
        try {
          conversationFetcher = setInterval(async () => {
            await getConversations();
            console.log('tick', Date.now());
          }, 5000);
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
  }, [conversations]);

  const getConversations = async (): Promise<void> => {
    if (pushUser && privateKey && setConversations) {
      const newConversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      console.log('newConversations: ', newConversations);
      const stateConversations = JSON.parse(JSON.stringify(conversations));
      console.log('conversations: ', stateConversations);
      const hasConversationsChanged =
        JSON.stringify(newConversations) !== JSON.stringify(stateConversations);
      if (hasConversationsChanged) {
        console.log('conversations changed');
        setConversations(newConversations);
      }
    }
  };
};

export default useConversationListener;

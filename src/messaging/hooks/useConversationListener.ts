import { useEffect, useState, FC, useContext } from 'react';
import PushContext from '../context/pushUser';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';

const useConversationListener = () => {
  const { conversations, setConversations, pushUser, privateKey } = useContext(PushContext);

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

    //TODO set interval to fetch conversations in Push Context when Store initiated

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

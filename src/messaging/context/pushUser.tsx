import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { IUser } from '@pushprotocol/restapi';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';

const PushContext = createContext<{
  pushUser?: IUser;
  pushUserExists?: boolean;
  conversations?: Message[];
  requests?: Message[];
  conversationMessages?: Map<string, IMessageIPFS[]>;
  getConversations?: () => Promise<void>;
  getRequests?: () => Promise<void>;
  setConversations?: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
  setConversationMessages?: React.Dispatch<
    React.SetStateAction<Map<string, IMessageIPFS[]> | undefined>
  >;
  disconnect?: () => void;
  initPush?: (address: string) => void;
  privateKey?: string;
  conversationsLoaded: boolean;
  messagesLoaded: boolean;
  checkPushUserExistence?: (address: string) => Promise<IUser | undefined>;
}>({
  pushUser: undefined,
  pushUserExists: false,
  conversations: undefined,
  requests: undefined,
  conversationMessages: undefined,
  getConversations: undefined,
  getRequests: undefined,
  setConversations: undefined,
  setConversationMessages: undefined,
  disconnect: undefined,
  initPush: undefined,
  privateKey: undefined,
  conversationsLoaded: false,
  messagesLoaded: false,
  checkPushUserExistence: undefined,
});

const PushProvider = ({ children }: { children: ReactNode }) => {
  const [pushUser, setPushUser] = useState<IUser | undefined>();
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Message[] | undefined>();
  const [requests, setRequests] = useState<Message[] | undefined>();
  const [conversationMessages, setConversationMessages] = useState<Map<string, IMessageIPFS[]>>();
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [pushUserExists, setPushUserExists] = useState(false);

  const disconnect = (): void => {
    setConversations(undefined);
    setConversationMessages(undefined);
    setRequests(undefined);
    setPrivateKey(undefined);
    setPushUser(undefined);
    setPushUserExists(false);
  };

  const checkPushUserExistence = async (account: string): Promise<IUser | undefined> => {
    console.log('Check User existence');
    try {
      const pushUserData = await createUserIfNecessary({ account });
      pushUserData ? setPushUserExists(true) : setPushUserExists(false);
      return pushUserData;
    } catch (e) {
      console.error(e);
    }
  };

  const init = async (account: string) => {
    console.log('init');
    try {
      const pushUserData = await createUserIfNecessary({ account });
      if (pushUserData) {
        setPushUser(pushUserData);
        setPushUserExists(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const decodePrivateKey = async (): Promise<void> => {
    console.log('Decode Private key');
    if (pushUser) {
      const pgpPrivateKey = await chatApi.decryptWithWalletRPCMethod(
        pushUser.encryptedPrivateKey,
        pCAIP10ToWallet(pushUser.wallets),
      );
      setPrivateKey(pgpPrivateKey);
    }
  };

  const getConversationsAndMessages = async (): Promise<void> => {
    console.log('Get conversations');
    if (pushUser && privateKey) {
      try {
        // Gets the first message of the conversation
        const conversations = await chatApi.chats({
          pgpPrivateKey: privateKey,
          account: pushUser.wallets,
        });
        setConversations(conversations);
        setConversationsLoaded(true);
        await getMessages(conversations);
      } catch (e) {
        console.error(e);
        setConversationsLoaded(true);
        setMessagesLoaded(true);
      }
    }
  };

  const getRequests = async (): Promise<void> => {
    console.log('Get requests');
    if (pushUser && privateKey) {
      const latestRequests = await chatApi.requests({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      setRequests(latestRequests);
    }
  };

  const getMessages = async (conversations: Message[]): Promise<void> => {
    const messagesMap = new Map<string, IMessageIPFS[]>();

    if (conversations && pushUser) {
      try {
        for (const conversation of conversations) {
          setMessagesLoaded(false);
          console.log('for loop', conversation.toCAIP10);
          const messages = [];
          if (conversation.link && pushUser) {
            // Gets all historical messages of the conversation except the first one
            const historicalMessages = await chatApi.history({
              threadhash: conversation.link,
              account: pushUser.wallets,
              pgpPrivateKey: privateKey,
            });
            messages.push(...historicalMessages);
          }
          // Add here the first message of the conversation the messages array
          messages.push(conversation);
          messages.sort((messageA, messageB) => {
            if (messageA.timestamp && messageB.timestamp)
              return messageA.timestamp - messageB.timestamp;
            return 1;
          });
          messagesMap.set(conversation.toCAIP10, messages);
        }
      } catch (e) {
        console.error(e);
        setMessagesLoaded(true);
      }
      setMessagesLoaded(true);
      setConversationMessages(messagesMap);
    }
  };

  useEffect(() => {
    try {
      decodePrivateKey();
    } catch (e) {
      console.error(e);
    }
    return () => {
      setPrivateKey(undefined);
    };
  }, [pushUser]);

  useEffect(() => {
    try {
      getConversationsAndMessages();
      getRequests();
    } catch (e) {
      console.error(e);
    }
    return () => {
      setConversations(undefined);
      setConversationMessages(undefined);
    };
  }, [privateKey]);

  const value = useMemo(() => {
    return {
      pushUser: pushUser ? pushUser : undefined,
      conversations: conversations ? conversations : undefined,
      requests: requests ? requests : undefined,
      conversationMessages: conversationMessages ? conversationMessages : undefined,
      privateKey: privateKey ? privateKey : undefined,
      setConversations,
      setConversationMessages,
      getConversations: getConversationsAndMessages,
      getRequests,
      disconnect: disconnect,
      initPush: init,
      conversationsLoaded,
      messagesLoaded,
      checkPushUserExistence,
      pushUserExists,
    };
  }, [pushUser, conversations, getConversationsAndMessages, conversationMessages]);

  return <PushContext.Provider value={value}>{children}</PushContext.Provider>;
};

export { PushProvider };

export default PushContext;

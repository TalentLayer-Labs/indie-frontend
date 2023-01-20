import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { IUser } from '@pushprotocol/restapi';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { chat as chatApi, user as userApi } from '@pushprotocol/restapi/src/lib';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { useSigner } from 'wagmi';
import { ChatMessage } from '../../../types';
import { buildChatMessage } from '../utils/messaging';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';

const PushContext = createContext<{
  pushUser?: IUser;
  conversations?: Message[];
  requests?: Message[];
  conversationMessages?: Map<string, ChatMessage[]>;
  getConversations?: () => Promise<void>;
  getRequests?: () => Promise<void>;
  setConversations?: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
  setConversationMessages?: React.Dispatch<
    React.SetStateAction<Map<string, ChatMessage[]> | undefined>
  >;
  getOneConversationMessages: (conversation: Message) => Promise<void>;
  disconnect?: () => void;
  initPush?: (address: string) => void;
  privateKey?: string;
  conversationsLoaded: boolean;
  messagesLoaded: boolean;
}>({
  pushUser: undefined,
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getOneConversationMessages: async () => {},
  conversationsLoaded: false,
  messagesLoaded: false,
});

const PushProvider = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const [pushUser, setPushUser] = useState<IUser | undefined>();
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Message[] | undefined>();
  const [requests, setRequests] = useState<Message[] | undefined>();
  const [conversationMessages, setConversationMessages] = useState<Map<string, ChatMessage[]>>();
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [chatInitiated, setChatInitiated] = useState(false);

  const disconnect = (): void => {
    setConversations(undefined);
    setConversationMessages(undefined);
    setRequests(undefined);
    setPrivateKey(undefined);
    setPushUser(undefined);
  };

  const checkPushUserExistence = async (account: string): Promise<IUser | undefined> => {
    console.log('Check User existence');
    try {
      const pushUserData = await userApi.get({ account });
      // const pushUserData = await createUserIfNecessary({ account });
      pushUserData ? setPushUser(pushUserData) : '';
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
      }
      decodePrivateKey();
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

  const getOneConversationMessages = async (
    conversation: Message,
    // conversationOrAddress: Message | string,
  ): Promise<void> => {
    const messagesMap = conversationMessages
      ? conversationMessages
      : new Map<string, ChatMessage[]>();
    // let conversation: Message;
    // if (typeof conversationOrAddress === 'string' && conversations) {
    //   conversation = conversations?.find(c => c.toCAIP10 === conversationOrAddress);
    // }
    console.log('Getting messages for conversation', conversation.toCAIP10);
    setMessagesLoaded(false);
    if (pushUser) {
      try {
        // setMessagesLoaded(false);
        const messages = [];
        if (conversation.link && pushUser) {
          // Gets all historical messages of the conversation except the first one
          const historicalMessages: IMessageIPFS[] = await chatApi.history({
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
        const chatMessages: ChatMessage[] = messages.map(message => buildChatMessage(message));
        messagesMap.set(conversation.toCAIP10, chatMessages);
      } catch (e) {
        console.error(e);
      } finally {
        setConversationMessages(messagesMap);
        console.log('Messages loaded');
        setMessagesLoaded(true);
      }
    }
  };

  const getConversations = async (): Promise<void> => {
    console.log('Get conversations');
    if (pushUser && privateKey) {
      try {
        // Gets the first message of the conversation
        const response = await chatApi.chats({
          pgpPrivateKey: privateKey,
          account: pushUser.wallets,
        });
        setConversations(response);
      } catch (e) {
        console.error(e);
      } finally {
        if (!conversationsLoaded) {
          setConversationsLoaded(true);
        }
      }
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
    const messagesMap = new Map<string, ChatMessage[]>();

    if (conversations && pushUser) {
      try {
        for (const conversation of conversations) {
          setMessagesLoaded(false);
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
          const chatMessages: ChatMessage[] = messages.map(message => buildChatMessage(message));
          messagesMap.set(conversation.toCAIP10, chatMessages);
        }
      } catch (e) {
        console.error(e);
        setMessagesLoaded(true);
      }
      setMessagesLoaded(true);
      setConversationMessages(messagesMap);
      if (!chatInitiated) {
        setChatInitiated(true);
      }
    }
  };

  useEffect(() => {
    console.log('Fetching Push User');
    // Checking user existence on wallet connecting
    const getPushUser = async (): Promise<void> => {
      if (signer && !pushUser) {
        checkPushUserExistence(await signer.getAddress());
      }
    };
    getPushUser();
  }, [signer]);

  useEffect(() => {
    try {
      getConversations();
      getRequests();
    } catch (e) {
      console.error(e);
    }
    return () => {
      setConversations(undefined);
      setConversationMessages(undefined);
    };
  }, [privateKey]);

  useEffect(() => {
    console.log('ChatInitiated');
    // Load messages of the latest conversation on login
    if (conversations) {
      getOneConversationMessages(conversations[0]);
    }
  }, [conversationsLoaded]);

  const value = useMemo(() => {
    return {
      pushUser: pushUser ? pushUser : undefined,
      conversations: conversations ? conversations : undefined,
      requests: requests ? requests : undefined,
      conversationMessages: conversationMessages ? conversationMessages : undefined,
      privateKey: privateKey ? privateKey : undefined,
      setConversations,
      setConversationMessages,
      getConversations,
      getRequests,
      getOneConversationMessages,
      disconnect: disconnect,
      initPush: init,
      conversationsLoaded,
      messagesLoaded,
    };
  }, [pushUser, conversations, getConversations, conversationMessages]);

  return <PushContext.Provider value={value}>{children}</PushContext.Provider>;
};

export { PushProvider };

export default PushContext;

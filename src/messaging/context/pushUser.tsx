import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { IUser } from '@pushprotocol/restapi';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { user as userApi, chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';

const PushContext = createContext<{
  pushUser?: IUser;
  conversations?: Message[];
  conversationMessages?: Map<string, IMessageIPFS[]>;
  getConversations?: (pushUser: IUser) => Promise<void>;
  setConversations?: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
  setConversationMessages?: React.Dispatch<
    React.SetStateAction<Map<string, IMessageIPFS[]> | undefined>
  >;
  disconnect?: () => void;
  initPush?: (address: string) => void;
  privateKey?: string;
}>({
  pushUser: undefined,
  conversations: undefined,
  conversationMessages: undefined,
  getConversations: undefined,
  setConversations: undefined,
  setConversationMessages: undefined,
  disconnect: undefined,
  initPush: undefined,
  privateKey: undefined,
});

const PushProvider = ({ children }: { children: ReactNode }) => {
  // const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { address } = useAccount();
  const [pushUser, setPushUser] = useState<IUser | undefined>();
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Message[] | undefined>();
  const [conversationMessages, setConversationMessages] = useState<Map<string, IMessageIPFS[]>>();
  const [getConversations, setGetConversations] = useState<(pushUser: IUser) => Promise<void>>();
  const [initPush, setInitPush] = useState<(address: string) => Promise<void>>();

  const disconnect = (): void => {
    setConversations(undefined);
    setConversationMessages(undefined);
    setPrivateKey(undefined);
    setPushUser(undefined);
  };

  const init = async (account: string) => {
    console.log('init');
    try {
      const pushUserData = await createUserIfNecessary({ account });
      if (pushUserData) {
        setPushUser(pushUserData);
        // setGetConversations(listConversation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //TODO set a reset of init for address change
  // useEffect(() => {
  //   if (address) {
  //     init(address);
  //   }
  // }, [address]);

  useEffect(() => {
    console.log('Decode Private key');
    try {
      const pushPrivateKey = sessionStorage.getItem('push-private-key');
      if (pushPrivateKey) {
        setPrivateKey(pushPrivateKey);
      } else {
        const decodePrivateKey = async (): Promise<void> => {
          if (pushUser) {
            console.log('pushUser: ', pushUser);
            const pgpPrivateKey = await chatApi.decryptWithWalletRPCMethod(
              pushUser.encryptedPrivateKey,
              pCAIP10ToWallet(pushUser.wallets),
            );
            setPrivateKey(pgpPrivateKey);
          }
        };
        decodePrivateKey();
      }
    } catch (e) {
      console.error(e);
    }
    return () => {
      setPrivateKey(undefined);
    };
  }, [pushUser]);

  useEffect(() => {
    //TODO Gets the first message of the conversation
    console.log('Get conversations');
    try {
      const listConversation = async (): Promise<void> => {
        if (pushUser && privateKey) {
          const conversations = await chatApi.chats({
            pgpPrivateKey: privateKey,
            account: pushUser.wallets,
          });
          console.log('conversations: ', conversations);
          setConversations(conversations);
        }
      };
      listConversation();
    } catch (e) {
      console.error(e);
    }
    return () => {
      setConversations(undefined);
    };
  }, [privateKey]);

  useEffect(() => {
    console.log('Get conversation messages');
    //TODO Gets all messages  of the conversation except the first message
    const getMessages = async (): Promise<void> => {
      // const messages = ...conversationMessages;
      const messagesMap = new Map<string, IMessageIPFS[]>();
      try {
        if (conversations && pushUser) {
          for (const conversation of conversations) {
            if (conversation.link) {
              const messages = await chatApi.history({
                threadhash: conversation.link,
                account: pushUser.wallets,
                pgpPrivateKey: privateKey,
              });
              // Add here the first message of the conversation the mesages array
              messages.push(conversation);
              messages.sort((messageA, messageB) => {
                return messageA.timestamp - messageB.timestamp;
              });
              //TODO pCAIP10ToWallet(conversation.toCAIP10) ?
              messagesMap.set(conversation.toCAIP10, messages);
            }
          }
          setConversationMessages(messagesMap);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getMessages();
    return () => {
      setConversationMessages(undefined);
    };
  }, [conversations]);

  // const listConversation = async (pushUser: IUser) => {
  //   try {
  //     const privateKey = await chatApi.decryptWithWalletRPCMethod(
  //       pushUser.encryptedPrivateKey,
  //       pCAIP10ToWallet(pushUser.wallets),
  //     );
  //
  //     const msgs = await chatApi.chats({
  //       pgpPrivateKey: privateKey,
  //       account: pushUser.wallets,
  //     });
  //     setConversations(msgs);
  //     console.log('msgs', msgs);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const value = useMemo(() => {
    return {
      pushUser: pushUser ? pushUser : undefined,
      conversations: conversations ? conversations : undefined,
      conversationMessages: conversationMessages ? conversationMessages : undefined,
      setConversations: setConversations,
      setConversationMessages: setConversationMessages,
      getConversations: getConversations,
      privateKey: privateKey ? privateKey : undefined,
      disconnect: disconnect,
      initPush: init,
    };
  }, [pushUser, conversations, getConversations, conversationMessages]);

  return <PushContext.Provider value={value}>{children}</PushContext.Provider>;
};

export { PushProvider };

export default PushContext;

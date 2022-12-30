import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { IUser } from '@pushprotocol/restapi';
import { Message } from '@pushprotocol/restapi/src/lib/chat/ipfs';
import { user as userApi, chat as chatApi } from '@pushprotocol/restapi/src/lib';
import { decryptMessage, pCAIP10ToWallet } from '@pushprotocol/restapi/src/lib/helpers';
import { IMessageIPFS } from '@pushprotocol/uiweb/lib/types';
import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { walletToPCAIP10 } from '@pushprotocol/restapi/src/lib/helpers/address';

const PushContext = createContext<{
  pushUser?: IUser;
  conversations?: Message[];
  requests?: Message[];
  conversationMessages?: Map<string, IMessageIPFS[]>;
  getConversations?: () => Promise<void>;
  setConversations?: React.Dispatch<React.SetStateAction<Message[] | undefined>>;
  setConversationMessages?: React.Dispatch<
    React.SetStateAction<Map<string, IMessageIPFS[]> | undefined>
  >;
  updateAfterSend?: (
    selectedConversationPeerAddress: string,
    latestEncryptedMessage: IMessageIPFS,
  ) => Promise<void>;
  disconnect?: () => void;
  initPush?: (address: string) => void;
  privateKey?: string;
}>({
  pushUser: undefined,
  conversations: undefined,
  requests: undefined,
  conversationMessages: undefined,
  getConversations: undefined,
  setConversations: undefined,
  setConversationMessages: undefined,
  updateAfterSend: undefined,
  disconnect: undefined,
  initPush: undefined,
  privateKey: undefined,
});

const PushProvider = ({ children }: { children: ReactNode }) => {
  // const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const [pushUser, setPushUser] = useState<IUser | undefined>();
  const [privateKey, setPrivateKey] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Message[] | undefined>();
  const [requests, setRequests] = useState<Message[] | undefined>();
  const [conversationMessages, setConversationMessages] = useState<Map<string, IMessageIPFS[]>>();

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

  //TODO set a reset of init for address change
  // useEffect(() => {
  //   if (address) {
  //     init(address);
  //   }
  // }, [address]);

  const getConversations = async (): Promise<void> => {
    console.log('Get conversations');
    if (pushUser && privateKey) {
      const conversations = await chatApi.chats({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      setConversations(conversations);
    }
  };

  const getRequests = async (): Promise<void> => {
    console.log('Get requests');
    if (pushUser && privateKey) {
      const requests = await chatApi.requests({
        pgpPrivateKey: privateKey,
        account: pushUser.wallets,
      });
      console.log('requests', requests);
      setRequests(requests);
    }
  };

  async function updateAfterSend(
    selectedConversationPeerAddress: string,
    latestEncryptedMessage: IMessageIPFS,
  ) {
    try {
      if (pushUser && privateKey) {
        //Decrypt sent message content (could also get from the "messageContent" state)
        const latestDecryptedMessage = await decryptMessage({
          encryptedMessage: latestEncryptedMessage.messageContent as string,
          signature: latestEncryptedMessage.signature as string,
          encryptedSecret: latestEncryptedMessage.encryptedSecret as string,
          encryptionType: latestEncryptedMessage.encType as string,
          signatureValidationPubliKey: pushUser.publicKey,
          pgpPrivateKey: privateKey,
        });
        //Create new IMessageIPFS object
        const latestMessage: IMessageIPFS = {
          ...latestEncryptedMessage,
          messageContent: latestDecryptedMessage,
        };
        //Update conversationMessages state with new message
        const messages = conversationMessages?.get(
          walletToPCAIP10(selectedConversationPeerAddress),
        );
        if (!messages) {
          // If first message in conversation, Re-fetch conversation data
          await getConversations();
        }
        if (messages && setConversationMessages) {
          messages.push(latestMessage);
          conversationMessages?.set(selectedConversationPeerAddress, messages);
          setConversationMessages(conversationMessages);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getMessagesFromOneConversation(
    conversation: Message,
    messagesMap: Map<string, IMessageIPFS[]>,
  ) {
    const messages = [];
    if (conversation.link && pushUser) {
      const historicalMessages = await chatApi.history({
        threadhash: conversation.link,
        account: pushUser.wallets,
        pgpPrivateKey: privateKey,
      });
      messages.push(...historicalMessages);
      console.log('messages: ', messages);
    }
    // Add here the first message of the conversation the messages array
    messages.push(conversation);
    messages.sort((messageA, messageB) => {
      return messageA.timestamp - messageB.timestamp;
    });
    //TODO pCAIP10ToWallet(conversation.toCAIP10) ?
    messagesMap.set(conversation.toCAIP10, messages);
  }

  const getMessages = async (): Promise<void> => {
    // const messages = ...conversationMessages;
    const messagesMap = new Map<string, IMessageIPFS[]>();
    try {
      if (conversations && pushUser) {
        for (const conversation of conversations) {
          const messages = [];
          if (conversation.link && pushUser) {
            const historicalMessages = await chatApi.history({
              threadhash: conversation.link,
              account: pushUser.wallets,
              pgpPrivateKey: privateKey,
            });
            messages.push(...historicalMessages);
            console.log('messages: ', messages);
          }
          // Add here the first message of the conversation the messages array
          messages.push(conversation);
          messages.sort((messageA, messageB) => {
            return messageA.timestamp - messageB.timestamp;
          });
          //TODO pCAIP10ToWallet(conversation.toCAIP10) ?
          messagesMap.set(conversation.toCAIP10, messages);
        }
        console.log('MessagesMap: ', messagesMap);
        setConversationMessages(messagesMap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      // const pushPrivateKey = sessionStorage.getItem('push-private-key');
      // if (pushPrivateKey) {
      //   setPrivateKey(pushPrivateKey);
      // } else {
      decodePrivateKey();
      // }
    } catch (e) {
      console.error(e);
    }
    return () => {
      setPrivateKey(undefined);
    };
  }, [pushUser]);

  useEffect(() => {
    //TODO Gets the first message of the conversation
    try {
      getConversations();
      getRequests();
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
    getMessages();
    return () => {
      setConversationMessages(undefined);
    };
  }, [conversations]);

  const value = useMemo(() => {
    return {
      pushUser: pushUser ? pushUser : undefined,
      conversations: conversations ? conversations : undefined,
      requests: requests ? requests : undefined,
      conversationMessages: conversationMessages ? conversationMessages : undefined,
      setConversations,
      setConversationMessages,
      getConversations,
      updateAfterSend,
      privateKey: privateKey ? privateKey : undefined,
      disconnect: disconnect,
      initPush: init,
    };
  }, [pushUser, conversations, getConversations, conversationMessages]);

  return <PushContext.Provider value={value}>{children}</PushContext.Provider>;
};

export { PushProvider };

export default PushContext;

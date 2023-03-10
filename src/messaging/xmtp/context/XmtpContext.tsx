import React, { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { buildChatMessage, CONVERSATION_PREFIX } from '../utils/messaging';
import { XmtpChatMessage } from '../../../types';

interface IProviderProps {
  client: Client | undefined;
  initClient: ((wallet: Signer) => Promise<void>) | undefined;
  loadingConversations: boolean;
  loadingMessages: boolean;
  conversations: Map<string, Conversation>;
  conversationMessages: Map<string, XmtpChatMessage[]>;
  // getOneConversationMessages: (conversation: Conversation) => Promise<void>;
  userExists: boolean;
  disconnect: (() => void) | undefined;
}

export const XmtpContext = createContext<{
  providerState?: IProviderProps;
  setProviderState?: React.Dispatch<React.SetStateAction<IProviderProps>>;
}>({
  providerState: undefined,
  setProviderState: undefined,
});

export const XmtpContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { address: walletAddress } = useAccount();

  const checkUserExistence = async (): Promise<boolean> => {
    if (signer) {
      const keys = await Client.getKeys(signer, { env: 'dev' });
      return !!keys;
    }
    return false;
  };

  const [providerState, setProviderState] = useState<IProviderProps>({
    client: undefined,
    initClient: undefined,
    loadingConversations: false,
    loadingMessages: false,
    conversations: new Map<string, Conversation>(),
    conversationMessages: new Map<string, XmtpChatMessage[]>(),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // getOneConversationMessages: async () => {},
    userExists: false,
    disconnect: undefined,
  });

  const disconnect = (): void => {
    setProviderState({
      ...providerState,
      client: undefined,
      conversations: new Map(),
      conversationMessages: new Map(),
      userExists: false,
    });
  };

  const initClient = async (wallet: Signer) => {
    console.log('initClient w signer: ', wallet);
    if (wallet && !providerState.client && signer) {
      try {
        const keys = await Client.getKeys(signer, { env: 'dev' });
        const client = await Client.create(null, {
          env: 'dev',
          privateKeyOverride: keys,
        });
        setProviderState({
          ...providerState,
          client,
          disconnect,
          userExists: !!keys,
          // getOneConversationMessages,
        });
      } catch (e: any) {
        throw e;
        /*TODO see if this is still useful... I think not, redefining the client
         prevents from calling it again after rejecting metamask popup */
        // setProviderState({
        //   ...providerState,
        //   client: undefined,
        // });
      }
    }
  };

  useEffect(() => {
    console.log('xmtp on signer change', signer);
    //Not disconnecting, did it manually in Messenging.tsx with Wagmi
    // signer ? setProviderState({ ...providerState, initClient }) : disconnect();

    console.log('Checking user existence');
    const checkUserExistence = async (): Promise<void> => {
      if (signer) {
        const userExists = await Client.canMessage(walletAddress as string, { env: 'dev' });
        setProviderState({ ...providerState, userExists, initClient });
      }
      console.log('ProviderState: ', providerState);
      console.log('InitClient: ', providerState.initClient);
    };
    checkUserExistence();
  }, [signer]);

  // watchAccount(() => {
  //   if (disconnect && initPush && user?.address) {
  //     const changeUser = async () => {
  //       disconnect();
  //       //TODO not working: "The requested account and/or method has not been authorized by the user."
  //       // await initPush(user?.address);
  //       navigate(`/messaging`);
  //     };
  //     changeUser();
  //   }
  // });

  useEffect(() => {
    if (!providerState.client) return;

    const listConversations = async (): Promise<void> => {
      // console.log('listConversations triggered by providerState.client: ', providerState.client);
      setProviderState({ ...providerState, loadingConversations: true, loadingMessages: true });
      const { client, conversationMessages, conversations } = providerState;
      if (client) {
        // (await client.conversations.list()).forEach(conv =>
        //   console.log(conv.context?.conversationId),
        // );
        let conv: Conversation[] = [];
        try {
          conv = (await client.conversations.list()).filter(conversation =>
            conversation.context?.conversationId.startsWith(CONVERSATION_PREFIX),
          );
        } catch (e: any) {
          console.log('Error listing conversations - ', e);
        } finally {
          setProviderState({ ...providerState, loadingConversations: false });
          console.log('conv loaded');
        }

        // console.log('TLV2 conv', conv);
        Promise.all(
          //TODO Here need to remove duplicates & find latest conversation + load its messages
          conv.map(async conversation => {
            if (conversation.peerAddress !== walletAddress) {
              let messages: DecodedMessage[] = [];
              try {
                // Returns a list of all messages to/from the peerAddress
                messages = await conversation.messages();
              } catch (e: any) {
                console.log('Error listing messages - ', e);
              }
              //Temp fix for conversation duplicates
              if (messages.length > 0) {
                console.log('xmpt context - conversation', conversation);
                // console.log('xmpt context - messages', messages);
                const chatMessages: XmtpChatMessage[] = messages.map(message =>
                  buildChatMessage(message),
                );
                // console.log('xmpt context - chatMessages', chatMessages);
                conversationMessages.set(conversation.peerAddress, chatMessages);
                conversations.set(conversation.peerAddress, conversation);
              }
              // conversationMessages.set(conversation.peerAddress, []);
              setProviderState({
                ...providerState,
                conversationMessages,
                conversations,
              });
            }
          }),
        ).then(() => {
          setProviderState({ ...providerState, loadingMessages: false });
          console.log('msgs loaded');
        });
      }
    };
    listConversations();
  }, [providerState.client]);

  const getOneConversationMessages = async (conversation: Conversation): Promise<void> => {
    if (conversation.peerAddress !== walletAddress) {
      console.log('xmpt context - getting messages for conversation: ', conversation);
      const { conversationMessages } = providerState;
      // Returns a list of all messages to/from the peerAddress
      const messages: DecodedMessage[] = await conversation.messages();
      //Temp fix for conversation duplicates
      if (messages.length > 0) {
        console.log('xmpt context - messages', messages);
        const chatMessages: XmtpChatMessage[] = messages.map(message => buildChatMessage(message));
        console.log('xmpt context - chatMessages', chatMessages);
        conversationMessages.set(conversation.peerAddress, chatMessages);
      }
      setProviderState({
        ...providerState,
        conversationMessages,
      });
    }
  };

  const value = useMemo(() => {
    return {
      providerState,
      setProviderState,
    };
  }, [signer, providerState]);

  return <XmtpContext.Provider value={value}>{children}</XmtpContext.Provider>;
};

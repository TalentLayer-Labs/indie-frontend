import React, { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { useAccount, useWalletClient } from 'wagmi';
import { buildChatMessage, CONVERSATION_PREFIX } from '../utils/messaging';
import { XmtpChatMessage } from '../utils/types';

type clientEnv = 'local' | 'dev' | 'production' | undefined;

interface IProviderProps {
  client: Client | undefined;
  initClient: ((wallet: Signer) => Promise<void>) | undefined;
  loadingConversations: boolean;
  loadingMessages: boolean;
  conversations: Map<string, Conversation>;
  conversationMessages: Map<string, XmtpChatMessage[]>;
  userExists: boolean;
  disconnect: (() => void) | undefined;
}

export const XmtpContext = createContext<{
  publicClientState?: IProviderProps;
  setProviderState?: React.Dispatch<React.SetStateAction<IProviderProps>>;
}>({
  publicClientState: undefined,
  setProviderState: undefined,
});

export const XmtpContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: walletClient } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const { address: walletAddress } = useAccount();

  const [publicClientState, setProviderState] = useState<IProviderProps>({
    client: undefined,
    initClient: undefined,
    loadingConversations: false,
    loadingMessages: false,
    conversations: new Map<string, Conversation>(),
    conversationMessages: new Map<string, XmtpChatMessage[]>(),
    userExists: false,
    disconnect: undefined,
  });

  const disconnect = (): void => {
    setProviderState({
      ...publicClientState,
      client: undefined,
      conversations: new Map(),
      conversationMessages: new Map(),
      userExists: false,
    });
  };

  const initClient = async (wallet: Signer) => {
    console.log('initClient w walletClient: ', wallet);
    if (wallet && !publicClientState.client && walletClient) {
      try {
        const keys = await Client.getKeys(walletClient, {
          env: process.env.NEXT_PUBLIC_MESSENGING_ENV as clientEnv,
        });
        const client = await Client.create(null, {
          env: process.env.NEXT_PUBLIC_MESSENGING_ENV as clientEnv,
          privateKeyOverride: keys,
        });
        setProviderState({
          ...publicClientState,
          client,
          disconnect,
          userExists: !!keys,
          // getOneConversationMessages,
        });
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    const checkUserExistence = async (): Promise<void> => {
      if (walletClient) {
        const userExists = await Client.canMessage(walletAddress as string, {
          env: process.env.NEXT_PUBLIC_MESSENGING_ENV as clientEnv,
        });
        setProviderState({ ...publicClientState, userExists, initClient });
      }
    };
    checkUserExistence();
  }, [walletClient]);

  useEffect(() => {
    if (!publicClientState.client) return;

    const listConversations = async (): Promise<void> => {
      setProviderState({ ...publicClientState, loadingConversations: true, loadingMessages: true });
      const { client, conversationMessages, conversations } = publicClientState;
      if (client) {
        let conv: Conversation[] = [];
        try {
          conv = (await client.conversations.list()).filter(conversation =>
            conversation.context?.conversationId.startsWith(CONVERSATION_PREFIX),
          );
        } catch (e: any) {
          console.log('Error listing conversations - ', e);
        } finally {
          setProviderState({ ...publicClientState, loadingConversations: false });
        }

        Promise.all(
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
                const chatMessages: XmtpChatMessage[] = messages.map(message =>
                  buildChatMessage(message),
                );
                conversationMessages.set(conversation.peerAddress, chatMessages);
                conversations.set(conversation.peerAddress, conversation);
              }
              setProviderState({
                ...publicClientState,
                conversationMessages,
                conversations,
              });
            }
          }),
        ).then(() => {
          setProviderState({ ...publicClientState, loadingMessages: false });
        });
      }
    };
    listConversations();
  }, [publicClientState.client]);

  const value = useMemo(() => {
    return {
      publicClientState,
      setProviderState,
    };
  }, [walletClient, publicClientState]);

  return <XmtpContext.Provider value={value}>{children}</XmtpContext.Provider>;
};

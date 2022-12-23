import React, { useState, createContext, useEffect, ReactNode, useMemo } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import { CONVERSATION_PREFIX } from '../utils/messaging';

interface IProviderProps {
  client: Client | undefined;
  initClient: ((wallet: Signer) => Promise<void>) | undefined;
  loadingConversations: boolean;
  conversations: Map<string, Conversation>;
  conversationMessages: Map<string, DecodedMessage[]>;
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
  const [providerState, setProviderState] = useState<IProviderProps>({
    client: undefined,
    initClient: undefined,
    loadingConversations: false,
    conversations: new Map<string, Conversation>(),
    conversationMessages: new Map<string, DecodedMessage[]>(),
    disconnect: undefined,
  });

  const disconnect = (): void => {
    setProviderState({
      ...providerState,
      client: undefined,
      conversations: new Map(),
      conversationMessages: new Map(),
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
        });
      } catch (e) {
        console.error(e);
        setProviderState({
          ...providerState,
          client: undefined,
        });
      }
    }
  };

  useEffect(() => {
    console.log('xmtp on signer change');
    //Not disconnecting, did it manually in Messenging.tsx with Wagmi
    signer ? setProviderState({ ...providerState, initClient }) : disconnect();
    // console.log(providerState);
    // eslint-disable-next-line
  }, [signer]);

  useEffect(() => {
    if (!providerState.client) return;

    const listConversations = async () => {
      console.log('listConversations triggered by providerState.client: ', providerState.client);
      setProviderState({ ...providerState, loadingConversations: true });
      const { client, conversationMessages, conversations } = providerState;
      if (client) {
        // (await client.conversations.list()).forEach(conv =>
        //   console.log(conv.context?.conversationId),
        // );
        const conv = (await client.conversations.list()).filter(conversation =>
          conversation.context?.conversationId.startsWith(CONVERSATION_PREFIX),
        );
        console.log('TLV2 conv', conv);
        Promise.all(
          conv.map(async conversation => {
            if (conversation.peerAddress !== walletAddress) {
              // Returns a list of all messages to/from the peerAddress
              const messages = await conversation.messages();
              //Temp fix for conversation duplicates
              if (messages.length > 0) {
                console.log('xmpt context - conversation', conversation);
                console.log('xmpt context - messages', messages);
                conversationMessages.set(conversation.peerAddress, messages);
                conversations.set(conversation.peerAddress, conversation);
              }
              setProviderState({
                ...providerState,
                conversationMessages,
                conversations,
              });
            }
          }),
        ).then(() => {
          setProviderState({ ...providerState, loadingConversations: false });
        });
      }
    };
    listConversations();
  }, [providerState.client]);

  const value = useMemo(() => {
    return {
      providerState,
      setProviderState,
    };
  }, [signer, providerState]);

  return <XmtpContext.Provider value={value}>{children}</XmtpContext.Provider>;
};

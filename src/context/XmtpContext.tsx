import React, { useState, createContext, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { Signer } from 'ethers';
import { useAccount, useSigner } from 'wagmi';

interface IProviderProps {
  client: Client | undefined;
  initClient: ((wallet: Signer) => Promise<void>) | undefined;
  loadingConversations: boolean;
  conversations: Map<string, Conversation>;
  conversationMessages: Map<string, DecodedMessage[]>;
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
  });

  const initClient = async (wallet: Signer) => {
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

  const disconnect = () => {
    setProviderState({
      ...providerState,
      client: undefined,
      conversations: new Map(),
      conversationMessages: new Map(),
    });
  };

  useEffect(() => {
    // console.log('initClient');
    signer ? setProviderState({ ...providerState, initClient }) : disconnect();
    // console.log(providerState);
    // eslint-disable-next-line
  }, [signer]);

  useEffect(() => {
    if (!providerState.client) return;

    const listConversations = async () => {
      setProviderState({ ...providerState, loadingConversations: true });
      const { client, conversationMessages, conversations } = providerState;
      if (client) {
        const convos = (await client.conversations.list()).filter(
          conversation => !conversation.context?.conversationId,
        );
        Promise.all(
          convos.map(async conversation => {
            if (conversation.peerAddress !== walletAddress) {
              // Returns a list of all messages to/from the peerAddress
              const messages = await conversation.messages();
              conversationMessages.set(conversation.peerAddress, messages);
              conversations.set(conversation.peerAddress, conversation);
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
    // eslint-disable-next-line
  }, [providerState.client]);

  const value = useMemo(() => {
    return {
      providerState,
      setProviderState,
    };
  }, [signer, providerState]);

  return <XmtpContext.Provider value={value}>{children}</XmtpContext.Provider>;
};

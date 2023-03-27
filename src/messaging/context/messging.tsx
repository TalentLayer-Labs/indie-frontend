import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { ethers } from 'ethers';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSigner } from 'wagmi';
import TalentLayerContext from '../../context/talentLayer';
import { ConversationDisplayType } from '../../types';
import PushContext from '../push/context/pushUser';
import { XmtpContext } from '../xmtp/context/XmtpContext';

const MessagingContext = createContext<{
  userExists: () => boolean;
  handleRegisterToMessaging: () => Promise<void>;
  handleMessageUser: (userAddress: string) => Promise<void>;
}>({
  userExists: () => false,
  handleRegisterToMessaging: () => Promise.resolve(),
  handleMessageUser: (userAddress: string) => Promise.resolve(),
});

const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(TalentLayerContext);
  const { providerState } = useContext(XmtpContext);
  const { initPush, conversationMessages, pushUser } = useContext(PushContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const navigate = useNavigate();

  const userExists = (): boolean => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
      if (pushUser) {
        return !pushUser;
      }
    } else if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
      if (providerState) {
        return providerState?.userExists;
      }
    }
    return false;
  };

  const handleRegisterToMessaging = async (): Promise<void> => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
      try {
        if (user?.address) {
          await createUserIfNecessary({ account: user.address });
        }
      } catch (e) {
        console.error('CreateProposal - Error initializing Push client :', e);
      }
    }
    if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
      try {
        if (user?.address && providerState?.initClient && signer) {
          await providerState.initClient(signer);
        }
      } catch (e) {
        console.error('CreateProposal - Error initializing XMTP client :', e);
      }
    }
  };

  const handleMessageUser = async (userAddress: string): Promise<void> => {
    if (import.meta.env.VITE_MESSENGING_TECH === 'push') {
      if (user && initPush) {
        try {
          await initPush(user.address);
        } catch (e) {
          console.log('ServiceDetail - Error initializing Push client: ', e);
          return;
        }
        const buyerAddress = ethers.utils.getAddress(userAddress);
        let newMessage: boolean;
        // Check if conversation exists
        if (conversationMessages) {
          conversationMessages?.get(buyerAddress)?.length === 0
            ? (newMessage = true)
            : (newMessage = false);
          navigate(`/messaging/${ConversationDisplayType.CONVERSATION}/${buyerAddress}`, {
            state: { newMessage },
          });
        }
      }
    }
    if (import.meta.env.VITE_MESSENGING_TECH === 'xmtp') {
      if (signer && providerState) {
        //If initClient() is in the context, then we can assume that the user has not already logged in
        if (providerState.initClient) {
          try {
            await providerState.initClient(signer);
          } catch (e) {
            console.log('ServiceDetail - Error initializing XMTP client: ', e);
            return;
          }
        }
        const buyerAddress = ethers.utils.getAddress(userAddress);
        navigate(`/messaging/${buyerAddress}`);
      }
    }
  };

  const value = useMemo(() => {
    return {
      userExists,
      handleRegisterToMessaging,
      handleMessageUser,
    };
  }, [userExists, handleRegisterToMessaging, handleMessageUser]);

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};

export { MessagingProvider };

export default MessagingContext;

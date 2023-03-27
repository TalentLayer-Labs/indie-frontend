import { createUserIfNecessary } from '@pushprotocol/restapi/src/lib/chat/helpers';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useSigner } from 'wagmi';
import TalentLayerContext from '../../context/talentLayer';
import PushContext from '../push/context/pushUser';
import { XmtpContext } from '../xmtp/context/XmtpContext';

const MessagingContext = createContext<{
  userExists: () => boolean;
  handleRegisterToMessaging: () => Promise<void>;
}>({
  userExists: () => false,
  handleRegisterToMessaging: () => Promise.resolve(),
});

const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(TalentLayerContext);
  const { providerState } = useContext(XmtpContext);
  const { pushUser } = useContext(PushContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });

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

  const value = useMemo(() => {
    return {
      userExists,
      handleRegisterToMessaging,
    };
  }, [userExists, handleRegisterToMessaging]);

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
};

export { MessagingProvider };

export default MessagingContext;

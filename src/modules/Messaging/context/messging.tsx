import { useRouter } from 'next/router';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useWalletClient } from 'wagmi';
import TalentLayerContext from '../../../context/talentLayer';
import { XmtpContext } from './XmtpContext';
import { getAddress } from 'viem';

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
  const { publicClientState } = useContext(XmtpContext);
  const { data: walletClient } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const router = useRouter();

  const userExists = (): boolean => {
    return publicClientState ? publicClientState.userExists : false;
  };

  const handleRegisterToMessaging = async (): Promise<void> => {
    try {
      if (user?.address && publicClientState?.initClient && walletClient) {
        await publicClientState.initClient(walletClient);
      }
    } catch (e) {
      console.error('Error initializing XMTP client :', e);
    }
  };

  const handleMessageUser = async (userAddress: string): Promise<void> => {
    if (walletClient && publicClientState) {
      //If initClient() is in the context, then we can assume that the user has not already logged in
      if (publicClientState.initClient) {
        try {
          await publicClientState.initClient(walletClient);
        } catch (e) {
          console.log('ServiceDetail - Error initializing XMTP client: ', e);
          return;
        }
      }
      const buyerAddress = getAddress(userAddress);
      router.push(`/messaging/${buyerAddress}`);
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

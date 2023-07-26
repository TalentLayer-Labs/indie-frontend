import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import TalentLayerContext from '../../../context/talentLayer';
import { IExecDataProtector } from '@iexec/dataprotector';
import { useProvider } from 'wagmi';
import { useSigner } from 'wagmi';
import { providers } from 'ethers';

const Web3MailContext = createContext<{
  platformHasAccess: boolean;
}>({
  platformHasAccess: false,
});

const Web3MailProvider = ({ children }: { children: ReactNode }) => {
  const { account } = useContext(TalentLayerContext);
  const [platformHasAccess, setPlatformHasAccess] = useState(false);
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  console.log('Web3MailProvider ---- init');

  useEffect(() => {
    if (!account?.isConnected || !signer?.provider || !window.ethereum || !provider) {
      return;
    }

    const dataProtector = new IExecDataProtector(provider as providers.ExternalProvider);
  }, [account, signer]);

  useEffect(() => {
    const fetchData = async () => {
      // TODO Async task
    };
    fetchData();
  }, []);

  const value = useMemo(() => {
    return {
      platformHasAccess,
    };
  }, [platformHasAccess]);

  return <Web3MailContext.Provider value={value}>{children}</Web3MailContext.Provider>;
};

export { Web3MailProvider };

export default Web3MailContext;

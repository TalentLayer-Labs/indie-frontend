import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { getUserByAddress } from '../queries/users';
import { IAccount, IUser } from '../types';
import { FetchSignerResult } from '@wagmi/core';
import { ethers, Signer } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { Magic, MagicSDKExtensionsOption } from 'magic-sdk';

interface magicProvider {
  magic: InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | undefined;
  ethersMagicProvider: ethers.providers.Web3Provider | undefined;
}

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  signer?: FetchSignerResult<Signer> | JsonRpcSigner | undefined;
  magicProvider?: magicProvider;
  isActiveDelegate: boolean;
}>({
  user: undefined,
  account: undefined,
  signer: undefined,
  magicProvider: undefined,
  isActiveDelegate: false,
});

const TalentLayerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [signer, setSigner] = useState<FetchSignerResult<Signer> | JsonRpcSigner | undefined>(
    undefined,
  );
  const account = useAccount();
  const [isActiveDelegate, setIsActiveDelegate] = useState(false);
  const { data } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const [magicProvider, setMagicProvider] = useState<magicProvider | undefined>(undefined);
  const [magicSigner, setMagicSigner] = useState<ethers.providers.JsonRpcSigner | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_KEY as string, {
            network: {
              rpcUrl: process.env.NEXT_PUBLIC_RPC_PROVIDER_URL as string,
              chainId: 80001,
            },
          });
          const magicProvider = await magicInstance?.wallet.getProvider();
          const ethersMagicProvider = new ethers.providers.Web3Provider(magicProvider);
          setMagicProvider({ magic: magicInstance, ethersMagicProvider: ethersMagicProvider });
          setMagicSigner(ethersMagicProvider.getSigner());
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!account.address || !account.isConnected || !account.connector) {
        return;
      }

      try {
        const response = await getUserByAddress(account.address);
        if (response?.data?.data?.users[0] !== null) {
          setUser(response.data.data.users[0]);
          setIsActiveDelegate(
            process.env.NEXT_PUBLIC_ACTIVE_DELEGATE &&
              response.data.data.users[0].delegates &&
              response.data.data.users[0].delegates.indexOf(
                (process.env.NEXT_PUBLIC_DELEGATE_ADDRESS as string).toLowerCase(),
              ) !== -1,
          );
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [account.address, account.isConnected, isActiveDelegate]);

  useEffect(() => {
    // console.log('account', account);
    // console.log('account.connector', account.connector);
    // console.log('metamask connector', data);
    // console.log('magic', magicProvider);
    // console.log('magicSigner', magicSigner);
    if (!account.connector || (!data && !magicSigner)) {
      return;
    }
    try {
      console.log('good to go');
      const signer = account.connector?.id === 'magic' ? magicSigner : data;
      console.log('signer', signer);
      setSigner(signer);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      console.log('final user', user);
      console.log('final signer', signer);
    }
  }, [account.isConnected, account.connector, data, magicSigner]);

  const value = useMemo(() => {
    return {
      user,
      account: account ? account : undefined,
      signer,
      magicProvider,
      isActiveDelegate,
    };
  }, [
    account.address,
    user?.id,
    isActiveDelegate,
    account.connector,
    data,
    magicProvider?.ethersMagicProvider,
  ]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
};

export { TalentLayerProvider };

export default TalentLayerContext;

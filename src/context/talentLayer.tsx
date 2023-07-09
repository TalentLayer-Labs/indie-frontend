import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { getUserByAddress } from '../queries/users';
import { IAccount, IUser } from '../types';
import useMagic from '../modules/Magic/hooks/useMagic';
import { FetchSignerResult } from '@wagmi/core';
import { Signer } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  signer?: FetchSignerResult<Signer> | JsonRpcSigner | undefined;
  isActiveDelegate: boolean;
}>({
  user: undefined,
  account: undefined,
  signer: undefined,
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
  const { ethersMagicProvider } = useMagic();
  // console.log('ethersMagicProvider', ethersMagicProvider);
  const magicSigner = ethersMagicProvider?.getSigner();

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
    console.log('account', account);
    console.log('account.connector', account.connector);
    console.log('metamask connector', data);
    console.log('magic provider', ethersMagicProvider);
    if (!account.connector || (!data && !ethersMagicProvider)) {
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
  }, [account.isConnected, account.connector, data, ethersMagicProvider]);

  const value = useMemo(() => {
    return {
      user,
      account: account ? account : undefined,
      signer,
      isActiveDelegate,
    };
  }, [account.address, user?.id, isActiveDelegate, account.connector, data, ethersMagicProvider]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
};

export { TalentLayerProvider };

export default TalentLayerContext;

import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUserByAddress } from '../queries/users';
import { IAccount, IUser } from '../types';

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
}>({
  user: undefined,
  account: undefined,
});

const TalentLayerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const account = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (!account.address || !account.isConnected) {
        return;
      }

      try {
        const response = await getUserByAddress(account.address);
        console.log('response', response);

        if (response?.data?.data?.users[0] !== null) {
          setUser(response.data.data.users[0]);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [account.address, account.isConnected]);

  const value = useMemo(() => {
    return {
      user,
      account: account ? account : undefined,
    };
  }, [account.address, user?.id]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
};

export { TalentLayerProvider };

export default TalentLayerContext;

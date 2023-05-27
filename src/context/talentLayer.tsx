import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUserByAddress } from '../queries/users';
import { IAccount, IUser } from '../types';
import { config } from '../config';

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  isActiveDelegate: boolean;
}>({
  user: undefined,
  account: undefined,
  isActiveDelegate: false,
});

const TalentLayerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const account = useAccount();
  const [isActiveDelegate, setIsActiveDelegate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!account.address || !account.isConnected) {
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

  const value = useMemo(() => {
    return {
      user,
      account: account ? account : undefined,
      isActiveDelegate,
    };
  }, [account.address, user?.id, isActiveDelegate]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
};

export { TalentLayerProvider };

export default TalentLayerContext;

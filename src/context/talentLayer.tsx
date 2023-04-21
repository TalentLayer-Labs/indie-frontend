import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUserByAddress } from '../queries/users';
import { IAccount, IPlatform, IUser } from '../types';
import { getPlatformByAddress } from '../queries/platform';

const TalentLayerContext = createContext<{
  user?: IUser;
  account?: IAccount;
  platform?: IPlatform;
}>({
  user: undefined,
  account: undefined,
  platform: undefined,
});

const TalentLayerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>();
  const [platform, setPlatform] = useState<IPlatform | undefined>();
  const account = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (!account.address || !account.isConnected) {
        return;
      }

      try {
        // Get user by address
        const response = await getUserByAddress(account.address);
        if (response?.data?.data?.users[0]) {
          setUser(response.data.data.users[0]);
        }
        // Get platform by address
        const responsePlatform = await getPlatformByAddress(account.address);
        if (responsePlatform?.data?.data?.platforms.length > 0) {
          setPlatform(responsePlatform?.data?.data?.platforms[0]);
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
      platform,
    };
  }, [account.address, user?.id, platform?.id]);

  return <TalentLayerContext.Provider value={value}>{children}</TalentLayerContext.Provider>;
};

export { TalentLayerProvider };

export default TalentLayerContext;

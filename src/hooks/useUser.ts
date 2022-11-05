import { useAccount } from '@web3modal/react';
import { useEffect, useState } from 'react';
import { getUserByAddress } from '../services/queries';
import { User } from '../types';

const useUser = (): User | undefined => {
  const [user, setUser] = useState<User | undefined>();
  const { account } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (account.address === '' || account?.isConnected !== true) {
        return;
      }

      try {
        const response = await getUserByAddress(account.address);
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

  return user;
};

export default useUser;

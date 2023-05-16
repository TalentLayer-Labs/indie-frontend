import { useState, useEffect } from 'react';
import { getUserIdsByAddresses } from '../queries/users';

const useUserIdsByAddresses = (addresses: string[]): string[] | null => {
  const [userIds, setUserIds] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!addresses) {
          return;
        }
        const response = await getUserIdsByAddresses(addresses);
        if (response?.data?.data?.users) {
          setUserIds(response.data.data.users);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [addresses]);

  return userIds;
};

export default useUserIdsByAddresses;

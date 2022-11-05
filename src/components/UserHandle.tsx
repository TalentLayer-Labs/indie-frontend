import { useEffect, useState } from 'react';
import { getUserByAddress } from '../services/queries';

function UserHandle({ address }: { address: string }) {
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserByAddress(address);
        if (response?.data?.data?.users[0]?.handle !== undefined) {
          setHandle(response?.data?.data?.users[0].handle);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, [address]);

  if (handle === null) {
    return null;
  }

  return <span>{handle}</span>;
}

export default UserHandle;

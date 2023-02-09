import { useEffect, useState } from 'react';
import { getUsers } from '../queries/users';
import { IUser } from '../types';

const useUsers = (searchQuery?: string): IUser[] => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(import.meta.env.VITE_PLATFORM_ID, searchQuery);
        setUsers(response.data.data.users);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [searchQuery]);

  return users;
};

export default useUsers;

import { useState, useEffect } from 'react';
import { getUsers } from '../services/queries';
import { User } from '../types';

const useUsers = (): { users: User[] } => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        console.log(response);
        if (response?.data?.data?.users.length > 0) {
          setUsers(response.data.data.users);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return { users };
};

export default useUsers;

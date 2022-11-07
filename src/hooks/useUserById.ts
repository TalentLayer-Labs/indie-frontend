import { useState, useEffect } from 'react';
import { getUserById } from '../services/queries';
import { User } from '../types';

const useUserById = (userId: string): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserById(userId);
        if (response?.data?.data?.user) {
          setUser(response.data.data.user);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  return user;
};

export default useUserById;

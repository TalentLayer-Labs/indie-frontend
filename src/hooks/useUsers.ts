import { useEffect, useState } from 'react';
import { getUsers } from '../queries/users';
import { IUser } from '../types';

const useUsers = (
  searchQuery?: string,
  numberPerPage?: number,
  offset?: number,
): { noMoreData: boolean; loading: boolean; users: IUser[] } => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getUsers(numberPerPage, offset, searchQuery);
        setUsers([...users, ...response.data.data.users]);
        if (numberPerPage && response?.data?.data?.users.length < numberPerPage) {
          setNoMoreData(true);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numberPerPage, offset, searchQuery]);

  return { users, noMoreData, loading };
};

export default useUsers;

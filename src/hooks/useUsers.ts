import { useEffect, useState } from 'react';
import { getUsers } from '../queries/users';
import { IUser } from '../types';

const useUsers = (
  searchQuery?: string,
  numberPerPage?: number,
  offset?: number,
): { noMoreData: boolean; users: IUser[] } => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(numberPerPage, offset, searchQuery);

        if (response?.data?.data?.users.length === numberPerPage) {
          setUsers([...users, ...response.data.data.users]);
        }
        if (numberPerPage && response?.data?.data?.users.length < numberPerPage) {
          setNoMoreData(true);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [numberPerPage, offset, searchQuery]);

  return { users, noMoreData };
};

export default useUsers;

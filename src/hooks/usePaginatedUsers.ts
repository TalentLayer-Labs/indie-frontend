import { useEffect, useState } from 'react';
import { getPaginatedUsers, getUsers } from '../queries/users';
import { IUser } from '../types';

const usePaginatedUsers = (
  numberPerPage: number,
  offset: number,
  searchQuery?: string,
): { noMoreData: boolean; users: IUser[] } => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPaginatedUsers(numberPerPage, offset, searchQuery);

        if (response?.data?.data?.users.length === numberPerPage) {
          users.length > 0
            ? setUsers([...users, ...response.data.data.users])
            : setUsers(response.data.data.users);
        }
        if (response?.data?.data?.users.length < numberPerPage) {
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

export default usePaginatedUsers;

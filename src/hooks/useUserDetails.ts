import { useEffect, useState } from 'react';
import { IUserDetails } from '../types';
import { getUserById } from '../queries/users';

const useUserDetails = (userId: string | undefined): IUserDetails | null => {
  const [serviceDetails, setUserDetails] = useState<IUserDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const response = await getUserById(userId);
          if (response?.data?.data?.user?.description) {
            setUserDetails(response?.data?.data?.user?.description);
          }
        } catch (err: any) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      } else {
        setUserDetails(null);
      }
    };
    fetchData();
  }, [userId]);

  return serviceDetails;
};

export default useUserDetails;

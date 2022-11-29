import { useEffect, useState } from 'react';
import { getUserTotalGains } from '../queries/users';
import { IUserGain } from '../types';

const useTotalGainByUser = (id?: string | undefined): IUserGain[] => {
  const [userGains, setUserGains] = useState<IUserGain[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getUserTotalGains(id);

          if (response?.data?.data?.proposals) {
            setUserGains(response.data.data.proposals);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      } else {
        setUserGains([]);
      }
    };
    fetchData();
  }, [id]);

  return userGains;
};

export default useTotalGainByUser;

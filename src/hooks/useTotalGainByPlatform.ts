import { useEffect, useState } from 'react';
import { getTotalPlatformGains } from '../queries/platform';
import { IPlatformGain } from '../types';

const useTotalGainByPlatform = (id: string): IPlatformGain => {
  const [platformGains, setPlatformGains] = useState<IPlatformGain>();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getTotalPlatformGains(id);

          if (response?.data?.data?.platform?.totalPlatformGains) {
            setPlatformGains(response.data.data.platform.totalPlatformGains[0]);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    };
    fetchData();
  }, [id]);

  return <IPlatformGain>platformGains;
};

export default useTotalGainByPlatform;

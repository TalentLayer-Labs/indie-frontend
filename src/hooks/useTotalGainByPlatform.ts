import { useEffect, useState } from 'react';
import { getTotalPlatformGains } from '../queries/platform';
import { IPlatformGain } from '../types';

const useTotalGainByPlatform = (platformId: string): [IPlatformGain] => {
  const [platformGains, setPlatformGains] = useState<[IPlatformGain]>();

  useEffect(() => {
    const fetchData = async () => {
      if (platformId) {
        try {
          const response = await getTotalPlatformGains(platformId);

          if (response?.data?.data?.platform?.totalPlatformGains) {
            setPlatformGains(response.data.data.platform.totalPlatformGains);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    };
    fetchData();
  }, [platformId]);

  return <[IPlatformGain]>platformGains;
};

export default useTotalGainByPlatform;

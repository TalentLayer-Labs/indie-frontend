import { getPlatformByAddress } from '../queries/platform';
import { useEffect, useState } from 'react';
import { IPlatform } from '../types';

const usePlatformByAddress = (address: string | undefined): IPlatform | null => {
  const [platformDetails, setPlatformDetails] = useState<IPlatform | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatformByAddress(address);
        if (response?.data?.data?.platforms.length > 0) {
          setPlatformDetails(response.data.data.platforms[0]); // get only the first platform
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [address]);

  return platformDetails;
};

export default usePlatformByAddress;

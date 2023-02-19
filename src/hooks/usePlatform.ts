import { useState, useEffect } from 'react';
import { IPlatform } from '../types';
import { getPlatform } from '../queries/platform';

const usePlatform = (platformId: string | undefined): IPlatform | null => {
  const [platformDetails, setPlatformDetails] = useState<IPlatform | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatform(platformId);
        if (response?.data?.data?.platform?.id) {
          setPlatformDetails(response.data.data.platform);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [platformId]);

  return platformDetails;
};

export default usePlatform;

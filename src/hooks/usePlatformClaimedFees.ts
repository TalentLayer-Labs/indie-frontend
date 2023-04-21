import { useEffect, useState } from 'react';
import { getPlatformClaimedFees } from '../queries/platform';
import { IFeeClaim } from '../types';

const usePlatformClaimedFees = (platformId: string): [IFeeClaim] => {
  const [feeClaims, setFeeClaims] = useState<[IFeeClaim]>();

  useEffect(() => {
    const fetchData = async () => {
      if (platformId) {
        try {
          const response = await getPlatformClaimedFees(platformId);

          if (response?.data?.data?.platform?.feeClaims) {
            setFeeClaims(response.data.data.platform.feeClaims);
          }
        } catch (error: any) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    };
    fetchData();
  }, [platformId]);

  return <[IFeeClaim]>feeClaims;
};

export default usePlatformClaimedFees;

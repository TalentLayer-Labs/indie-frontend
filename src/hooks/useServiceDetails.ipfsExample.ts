import { useEffect, useState } from 'react';
import { IServiceDetails } from '../types';

/**
 * Example of ipfs query implementation for a service
 * Useful only if you need query non indexed data
 * @param cid
 */
const useServiceDetails = (cid: string): IServiceDetails | null => {
  const [serviceDetails, setServiceDetails] = useState<IServiceDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullSeviceDetailsUri = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}${cid}`;

        const response = await fetch(fullSeviceDetailsUri);

        const data: IServiceDetails = await response.json();
        if (data) {
          setServiceDetails(data);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [cid]);

  return serviceDetails;
};

export default useServiceDetails;

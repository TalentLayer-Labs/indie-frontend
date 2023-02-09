import { useEffect, useState } from 'react';
import { IServiceDescription } from '../types';

/**
 * Example of ipfs query implementation for a service
 * Useful only if you need query non indexed data
 * @param cid
 */
const useServiceDetails = (cid: string): IServiceDescription | null => {
  const [serviceDetails, setServiceDetails] = useState<IServiceDescription | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullSeviceDetailsUri = `${import.meta.env.VITE_IPFS_BASE_URL}${cid}`;

        const response = await fetch(fullSeviceDetailsUri);

        const data: IServiceDescription = await response.json();
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

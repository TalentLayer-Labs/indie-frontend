import { useState, useEffect } from 'react';
import { IServiceDetails } from '../types';

const useServiceDetails = (cid: string): IServiceDetails | null => {
  const [serviceDetails, setServiceDetails] = useState<IServiceDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullSeviceDetailsUri = `${import.meta.env.VITE_IPFS_BASE_URL}${cid}`;

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

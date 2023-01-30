import { useState, useEffect } from 'react';
import { IUserDetails } from '../types';

const useUserDetails = (cid: string | undefined): IUserDetails | null => {
  const [serviceDetails, setUserDetails] = useState<IUserDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullUserDetailsUri = `${import.meta.env.VITE_IPFS_BASE_URL}${cid}`;

        const response = await fetch(fullUserDetailsUri);
        const data: IUserDetails = await response.json();
        if (typeof data === 'object') {
          setUserDetails(data);
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

export default useUserDetails;

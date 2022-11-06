import { useState, useEffect } from 'react';
import { UserDetails } from '../types';
import { isValidHttpsUrl } from '../utils';

const useUserDetails = (uri: string | undefined): UserDetails | null => {
  const [serviceDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uri) return null;

        if (!isValidHttpsUrl(uri)) {
          throw new Error('Uri not valid: ' + uri);
        }

        const response = await fetch(uri);
        const data: UserDetails = await response.json();
        if (typeof data === 'object') {
          setUserDetails(data);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [uri]);

  return serviceDetails;
};

export default useUserDetails;

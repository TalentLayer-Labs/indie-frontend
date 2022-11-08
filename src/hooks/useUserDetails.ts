import { useState, useEffect } from 'react';
import { IUserDetails } from '../types';
import { isValidHttpsUrl } from '../utils';

const useUserDetails = (uri: string | undefined): IUserDetails | null => {
  const [serviceDetails, setUserDetails] = useState<IUserDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uri) return null;

        if (!isValidHttpsUrl(uri)) {
          throw new Error('Uri not valid: ' + uri);
        }

        const response = await fetch(uri);
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
  }, [uri]);

  return serviceDetails;
};

export default useUserDetails;

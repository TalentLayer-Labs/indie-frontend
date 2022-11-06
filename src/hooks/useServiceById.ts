import { useState, useEffect } from 'react';
import { getServiceById } from '../services/queries';
import { Service } from '../types';

const useServiceById = (serviceId: string): Service | null => {
  const [user, setUser] = useState<Service | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServiceById(serviceId);
        if (response?.data?.data?.service) {
          setUser(response.data.data.service);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [serviceId]);

  return user;
};

export default useServiceById;

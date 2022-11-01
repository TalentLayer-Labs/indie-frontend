import { useState, useEffect } from 'react';
import { getServices } from '../services/queries';
import { Service, ServiceStatus } from '../types';

const useServices = (serviceStatus?: ServiceStatus): { services: Service[] } => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServices(serviceStatus);
        if (response?.data?.data?.services) {
          setServices(response.data.data.services);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [serviceStatus]);

  return { services };
};

export default useServices;

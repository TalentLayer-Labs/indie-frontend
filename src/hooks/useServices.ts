import { useState, useEffect } from 'react';
import { getServices } from '../services/queries';
import { IService, ServiceStatusEnum } from '../types';

const useServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
): IService[] => {
  const [services, setServices] = useState<IService[]>([]);

  console.log('useServices', serviceStatus, buyerId, sellerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServices(serviceStatus, buyerId, sellerId);
        console.log('useServices response', response);
        if (response?.data?.data?.services.length > 0) {
          setServices(response.data.data.services);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [serviceStatus]);

  return services;
};

export default useServices;

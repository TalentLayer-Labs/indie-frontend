import { useState, useEffect } from 'react';
import { getServices } from '../queries/services';
import { IService, ServiceStatusEnum } from '../types';

const useServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
): IService[] => {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServices(serviceStatus, buyerId, sellerId);
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

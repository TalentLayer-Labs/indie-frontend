import { useEffect, useState } from 'react';
import { getServices, searchServices } from '../queries/services';
import { IService, ServiceStatusEnum } from '../types';

const useServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  searchQuery?: string,
): IService[] => {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchQuery) {
          response = await searchServices({
            serviceStatus,
            buyerId,
            sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery,
          });
          if (response?.data?.data?.serviceDescriptionSearchRank.length > 0) {
            const services = response.data.data.serviceDescriptionSearchRank.map(
              (serviceDescription: { service: any }) => {
                return {
                  ...serviceDescription.service,
                  description: {
                    ...serviceDescription,
                  },
                };
              },
            );
            setServices(services);
          }
        } else {
          response = await getServices({
            serviceStatus,
            buyerId,
            sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery,
          });
          if (response?.data?.data?.services.length > 0) {
            setServices(response.data.data.services);
          }
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

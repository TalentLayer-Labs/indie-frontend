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
          // if searchQuery is not empty, use searchServices/serviceDescriptionSearchRank
          response = await searchServices({
            serviceStatus,
            buyerId,
            sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery,
          });
          // map the response to match the format because service != serviceDescription
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
        } else {
          // if searchQuery is empty, use getServices without searchQuery and mapping
          response = await getServices({
            serviceStatus,
            buyerId,
            sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery: undefined,
          });
          setServices(response.data.data.services);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [serviceStatus, searchQuery, buyerId, sellerId]);

  return services;
};

export default useServices;

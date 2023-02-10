import { useEffect, useState } from 'react';
import { getServices, IServiceQueryProps, searchServices } from '../queries/services';
import { IService } from '../types';

const useServices = (
  props: IServiceQueryProps,
  setIsLoading?: (value: ((prevState: boolean) => boolean) | boolean) => void,
): IService[] => {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (props.searchQuery) {
          // if searchQuery is not empty, use searchServices/serviceDescriptionSearchRank
          response = await searchServices({
            serviceStatus: props.serviceStatus,
            buyerId: props.buyerId,
            sellerId: props.sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery: props.searchQuery,
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
            serviceStatus: props.serviceStatus,
            buyerId: props.buyerId,
            sellerId: props.sellerId,
            platformId: import.meta.env.VITE_PLATFORM_ID,
            searchQuery: undefined,
          });
          setServices(response.data.data.services);
        }
        setIsLoading ? setIsLoading(false) : null;
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [props]);

  return services;
};

export default useServices;

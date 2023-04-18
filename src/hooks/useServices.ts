import { useEffect, useState } from 'react';
import { getServices, searchServices } from '../queries/services';
import { IService, IServiceDetails, ServiceStatusEnum } from '../types';

const useServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  searchQuery?: string,
  numberPerPage?: number,
  offset?: number,
): { noMoreData: boolean; loading: boolean; services: IService[] } => {
  const [services, setServices] = useState<IService[]>([]);
  const [noMoreData, setNoMoreData] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        if (searchQuery) {
          response = await searchServices({
            serviceStatus,
            buyerId,
            sellerId,
            numberPerPage,
            offset,
            searchQuery,
          });
          if (response?.data?.data?.serviceDescriptionSearchRank.length > 0) {
            const newServices = response.data.data.serviceDescriptionSearchRank.map(
              (serviceDescription: { service: any }) => {
                return {
                  ...serviceDescription.service,
                  description: {
                    ...serviceDescription,
                  },
                };
              },
            );
            setServices([...services, ...newServices]);
            if (numberPerPage && newServices.length < numberPerPage) {
              setNoMoreData(true);
            }
          }
        } else {
          response = await getServices({
            serviceStatus,
            buyerId,
            sellerId,
            numberPerPage,
            offset,
          });
          const newServices = response?.data?.data?.services;
          if (newServices && newServices.length > 0) {
            setServices([...services, ...newServices]);
          }
          if (numberPerPage && newServices.length < numberPerPage) {
            setNoMoreData(true);
          }
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceStatus, numberPerPage, offset, searchQuery]);

  return { noMoreData, services, loading };
};

export default useServices;

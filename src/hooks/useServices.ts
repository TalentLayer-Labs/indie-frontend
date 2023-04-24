import { useEffect, useState } from 'react';
import { getServices, searchServices } from '../queries/services';
import { IService, ServiceStatusEnum } from '../types';

const useServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  searchQuery?: string,
  numberPerPage?: number,
): { hasMoreData: boolean; loading: boolean; services: IService[]; loadMore: () => void } => {
  const [services, setServices] = useState<IService[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

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
              setHasMoreData(false);
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
            setHasMoreData(false);
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

  const loadMore = () => {
    numberPerPage ? setOffset(offset + numberPerPage) : '';
  };

  return { hasMoreData: hasMoreData, services, loading, loadMore };
};

export default useServices;

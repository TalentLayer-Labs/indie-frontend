import { useEffect, useState } from 'react';
import { IService, ServiceStatusEnum } from '../types';
import { getFilteredServicesByKeywords } from '../pages/api/services/request';

const useFilteredServices = (
  serviceStatus?: ServiceStatusEnum,
  buyerId?: string,
  sellerId?: string,
  searchQuery?: string,
  numberPerPage?: number,
): {
  hasMoreData: boolean;
  loading: boolean;
  services: IService[];
  loadMore: () => void;
} => {
  const [services, setServices] = useState<IService[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setServices([]);
    setOffset(0);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response;
        let newServices: IService[] = [];

        response = await getFilteredServicesByKeywords(
          serviceStatus,
          buyerId,
          sellerId,
          numberPerPage,
          offset,
          searchQuery,
        );

        newServices = response?.data?.services;

        if (offset === 0) {
          setServices(newServices || []);
        } else {
          setServices([...services, ...newServices]);
        }
        if (numberPerPage && newServices.length < numberPerPage) {
          setHasMoreData(false);
        } else {
          setHasMoreData(true);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numberPerPage, offset, searchQuery]);

  const loadMore = () => {
    numberPerPage ? setOffset(offset + numberPerPage) : '';
  };

  return { hasMoreData: hasMoreData, services, loading, loadMore };
};

export default useFilteredServices;

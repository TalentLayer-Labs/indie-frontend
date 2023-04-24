import { useEffect, useState } from 'react';
import { getPaymentsForUser } from '../queries/payments';
import { IPayment } from '../types';

const usePaymentsForUser = (
  id: string,
  numberPerPage?: number | 10,
  startDate?: string,
  endDate?: string,
): { hasMoreData: boolean; loading: boolean; payments: IPayment[]; loadMore: () => void } => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPaymentsForUser(id, numberPerPage, offset, startDate, endDate);
        console.log('response', response);

        console.log('id', id);
        console.log('numberPerPage', numberPerPage);
        console.log('offset', offset);
        console.log('startDate', startDate);
        console.log('endDate', endDate);

        setPayments([...payments, ...response.data.data.payments]);

        if (numberPerPage && response?.data?.data?.payments?.length < numberPerPage) {
          setHasMoreData(false);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numberPerPage, offset, id, startDate, endDate]);

  const loadMore = () => {
    numberPerPage ? setOffset(offset + numberPerPage) : '';
  };

  return { payments, hasMoreData: hasMoreData, loading, loadMore };
};

export default usePaymentsForUser;

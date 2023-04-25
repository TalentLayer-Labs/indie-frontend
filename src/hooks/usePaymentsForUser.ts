import { useEffect, useState } from 'react';
import { getPaymentsForUser } from '../queries/payments';
import { IPayment } from '../types';

const usePaymentsForUser = (
  id: string,
  numberPerPage?: number,
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

        if (response && response.data && response.data.data) {
          setPayments([...payments, ...response.data.data.payments]);

          if (numberPerPage && response.data.data.payments.length < numberPerPage) {
            setHasMoreData(false);
          }
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

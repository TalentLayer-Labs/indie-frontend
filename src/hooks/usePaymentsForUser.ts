import { useEffect, useState } from 'react';
import { getPaymentsForUser } from '../queries/payments';
import { IPayment } from '../types';

const usePaymentsForUser = (
  id: string,
  numberPerPage: number,
  startDate?: string,
  endDate?: string,
): { hasMoreData: boolean; loading: boolean; payments: IPayment[]; loadMore: () => void } => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(1);

  const total = click * numberPerPage;

  const start = startDate ? new Date(startDate).getTime() / 1000 : '';
  const end = endDate ? new Date(endDate).getTime() / 1000 : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPaymentsForUser(id, total, 0, start.toString(), end.toString());

        if (response && response.data && response.data.data) {
          setPayments([...response.data.data.payments]);

          if (response.data.data.payments.length < total) {
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
  }, [total, id, start, end]);

  useEffect(() => {
    if (!!start && !!end) {
      setClick(1);
      setHasMoreData(true);
    }
  }, [start, end]);

  const loadMore = () => {
    setClick(click + 1);
  };

  return { payments, hasMoreData: hasMoreData, loading, loadMore };
};

export default usePaymentsForUser;

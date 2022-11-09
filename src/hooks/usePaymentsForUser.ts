import { useEffect, useState } from 'react';
import { getPaymentsForUser } from '../queries/payments';
import { IPayment } from '../types';

const usePaymentsForUser = (id: string): IPayment[] => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPaymentsForUser(id);

        if (response?.data?.data?.payments) {
          setPayments(response.data.data.payments);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  return payments;
};

export default usePaymentsForUser;

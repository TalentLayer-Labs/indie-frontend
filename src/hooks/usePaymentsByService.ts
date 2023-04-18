import { useEffect, useState } from 'react';
import { getPaymentsByService } from '../queries/payments';
import { IPayment, PaymentTypeEnum } from '../types';

const usePaymentsByService = (id: string, paymentType?: PaymentTypeEnum): IPayment[] => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPaymentsByService(id, paymentType);

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

export default usePaymentsByService;

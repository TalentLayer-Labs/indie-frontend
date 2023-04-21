import { useState, useEffect } from 'react';
import { IFeePayments } from '../types';
import { getFeePayments } from '../queries/feePayments';

const useFeePayments = (platformId: string): IFeePayments[] | null => {
  const [feePayments, setFeePayments] = useState<IFeePayments[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeePayments(platformId);
        if (response?.data?.data?.feePayments.length > 0) {
          setFeePayments(response.data.data.feePayments);
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchData();
  }, [platformId]);

  return feePayments;
};

export default useFeePayments;

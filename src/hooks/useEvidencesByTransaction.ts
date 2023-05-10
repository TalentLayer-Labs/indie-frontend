import { useEffect, useState } from 'react';
import { getPaymentsByService } from '../queries/payments';
import { IPayment, PaymentTypeEnum } from '../types';
import { IEvidence } from '../modules/Kleros/utils/types';
import { getEvidencesByPartyAndTransaction } from '../queries/evidences';

const useEvidences = (userId?: string, transactionID?: string): IEvidence[] => {
  const [evidences, setEvidences] = useState<IEvidence[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId || !transactionID) return;
        const response = await getEvidencesByPartyAndTransaction(transactionID, userId);

        if (response?.data?.data?.evidences) {
          setEvidences(response.data.data.evidences);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, [userId]);

  return evidences;
};

export default useEvidences;

import { useEffect, useState } from 'react';
import { IEvidence } from '../types';
import { getEvidencesTransactionId } from '../queries/evidences';

const useEvidences = (transactionID?: string): IEvidence[] => {
  const [evidences, setEvidences] = useState<IEvidence[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!transactionID) return;
        const response = await getEvidencesTransactionId(transactionID);

        if (response?.data?.data?.evidences) {
          setEvidences(response.data.data.evidences);
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, [transactionID]);

  return evidences;
};

export default useEvidences;

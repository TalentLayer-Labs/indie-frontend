import { useState, useEffect } from 'react';
import { IReviewDetails } from '../types';

const useReviewDetails = (uri: string): IReviewDetails | null => {
  const [reviewDetails, setReviewDetails] = useState<IReviewDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fullReviewDetailsUri = `${import.meta.env.VITE_IPFS_BASE_URL}${uri}`;

        const response = await fetch(fullReviewDetailsUri);
        const data: IReviewDetails = await response.json();
        if (data) {
          setReviewDetails(data);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [uri]);

  return reviewDetails;
};

export default useReviewDetails;

import { useState, useEffect } from 'react';
import { getReviewsByService } from '../services/queries';
import { Review } from '../types';

const useReviewsByService = (serviceId: string): { reviews: Review[] } => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReviewsByService(serviceId);
        if (response?.data?.data?.reviews) {
          setReviews(response.data.data.reviews);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [serviceId]);

  return { reviews };
};

export default useReviewsByService;

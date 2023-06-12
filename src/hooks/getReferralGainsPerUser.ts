import { useState, useEffect } from 'react';
import { IReferralGain } from '../types';
import { getReferralGainsByUserId } from '../queries/payments';

const getReferralGainsPerUser = (userId: string): IReferralGain[] | null => {
  const [referralData, setReferralData] = useState<IReferralGain[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReferralGainsByUserId(userId);
        console.log(response);
        if (response?.data?.data?.referralGains) {
          setReferralData(response.data.data.referralGains);
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  return referralData;
};

export default getReferralGainsPerUser;

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IFees } from '../types';
import { getPlatformFee, getFeesFromTransaction } from '../queries/fees';

const useFees = (transactionId: string): IFees => {
  const [fees, setFees] = useState({
    protocolFeeRate: ethers.BigNumber.from('0'),
    originPlatformFeeRate: ethers.BigNumber.from('0'),
    platformFeeRate: ethers.BigNumber.from('0'),
  });

  const platformId = import.meta.env.VITE_PLATFORMID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatformFee(platformId);
        const responseFromTransaction = await getFeesFromTransaction(transactionId);

        if (response?.data?.data?.platform && responseFromTransaction?.data?.data?.transaction) {
          setFees({
            protocolFeeRate: ethers.BigNumber.from(response.data.data.platform.fee),
            originPlatformFeeRate: ethers.BigNumber.from(
              responseFromTransaction.data.data.transaction.originPlatformFee,
            ),
            platformFeeRate: ethers.BigNumber.from(
              responseFromTransaction.data.data.transaction.protocolFee,
            ),
          });
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return fees;
};

export default useFees;

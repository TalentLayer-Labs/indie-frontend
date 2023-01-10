import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IFees } from '../types';
import { getProtocolAndOriginFee } from '../queries/fees';

const useFees = (transactionId: string): IFees => {
  const [fees, setFees] = useState({
    protocolFeeRate: 0,
    originPlatformFeeRate: 0,
    platformFeeRate: 0,
  });

  const platformId = import.meta.env.VITE_PLATFORMID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProtocolAndOriginFee(platformId);

        if (response?.data?.data?.platform) {
          setFees({
            protocolFeeRate: response.data.data.protocols.protocolFee,
            originPlatformFeeRate: response.data.data.protocols.originPlatformFee,
            platformFeeRate: response.data.data.platforms.fee,
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

import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IFees } from '../types';
import { getProtocolAndOriginFee } from '../queries/fees';

const useFees = (platformId: number): IFees => {
  const [fees, setFees] = useState({
    protocolEscrowFeeRate: 0,
    originPlatformEscrowFeeRate: 0,
    platformFeeRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProtocolAndOriginFee(platformId);

        if (response?.data?.data?.protocols && response?.data?.data?.platforms) {
          setFees({
            protocolEscrowFeeRate: response.data.data.protocols[0].protocolEscrowFeeRate,
            originPlatformEscrowFeeRate:
              response.data.data.protocols[0].originPlatformEscrowFeeRate,
            platformFeeRate: response.data.data.platforms[0].platformEscrowFeeRate,
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

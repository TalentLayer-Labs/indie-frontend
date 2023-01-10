import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IFees } from '../types';
import { getProtocolAndOriginFee } from '../queries/fees';

const useFees = (platformId: number): IFees => {
  const [fees, setFees] = useState({
    protocolFeeRate: 0,
    originPlatformFeeRate: 0,
    platformFeeRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProtocolAndOriginFee(platformId);
        console.log('useFees: response', response);

        if (response?.data?.data?.protocols && response?.data?.data?.platforms) {
          setFees({
            protocolFeeRate: response.data.data.protocols[0].escrowFee,
            originPlatformFeeRate: response.data.data.protocols[0].originPlatformFee,
            platformFeeRate: response.data.data.platforms[0].fee,
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

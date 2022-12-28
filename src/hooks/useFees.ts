import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { IFees } from '../types';
import { getPlatformFee } from '../queries/fees';

const useFees = (id: string): IFees => {
  const [fees, setFees] = useState({
    protocolFeeRate: ethers.BigNumber.from('0'),
    originPlatformFeeRate: ethers.BigNumber.from('0'),
    platformFeeRate: ethers.BigNumber.from('0'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatformFee('1');
        if (response?.data?.data?.platform) {
          setFees({
            protocolFeeRate: ethers.BigNumber.from(response.data.data.platform.fee),
            originPlatformFeeRate: ethers.BigNumber.from(response.data.data.platform.fee),
            platformFeeRate: ethers.BigNumber.from(response.data.data.platform.fee),
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

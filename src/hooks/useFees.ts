import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { config } from '../config';
import TalentLayerEscrow from '../contracts/ABI/TalentLayerEscrow.json';
import TalentLayerPlatformID from '../contracts/ABI/TalentLayerPlatformID.json';
import { IFees } from '../types';

const useFees = (): IFees => {
  const [fees, setFees] = useState({
    protocolFeeRate: 0,
    originPlatformFeeRate: 0,
    platformFeeRate: 0,
  });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });

  useEffect(() => {
    const fetchData = async () => {
      if (!signer) return fees;

      const talentLayerEscrow = new ethers.Contract(
        config.contracts.talentLayerEscrow,
        TalentLayerEscrow.abi,
        signer,
      );

      const talentLayerPlatformIdContract = new ethers.Contract(
        config.contracts.talentLayerPlatformId,
        TalentLayerPlatformID.abi,
        signer,
      );

      try {
        if (talentLayerEscrow && talentLayerPlatformIdContract) {
          const protocolFee = await talentLayerEscrow.protocolFee();
          const originPlatformFee = await talentLayerEscrow.originPlatformFee();
          const platformData = await talentLayerPlatformIdContract.platforms('1');
          if (!!protocolFee && !!originPlatformFee && !!platformData) {
            setFees({
              protocolFeeRate: protocolFee,
              originPlatformFeeRate: originPlatformFee,
              platformFeeRate: platformData.fee,
            });
          }
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  });

  return fees;
};

export default useFees;

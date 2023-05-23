import { useState, useEffect } from 'react';
import { BigNumber, Contract } from 'ethers';
import TalentLayerArbitrator from '../contracts/ABI/TalentLayerArbitrator.json';
import { useSigner } from 'wagmi';

const useArbitrationCost = (arbitratorAddress: string | undefined): BigNumber | null => {
  const [arbitrationCost, setArbitrationCost] = useState<BigNumber | null>(null);
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (signer && arbitratorAddress) {
          const talentLayerArbitrator = new Contract(
            arbitratorAddress,
            TalentLayerArbitrator.abi,
            signer,
          );
          const response = await talentLayerArbitrator.arbitrationPrice(
            process.env.NEXT_PUBLIC_PLATFORM_ID,
          );
          if (response) {
            setArbitrationCost(response);
          }
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [arbitratorAddress]);

  return arbitrationCost;
};

export default useArbitrationCost;

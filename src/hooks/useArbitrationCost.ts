import { useState, useEffect } from 'react';
import TalentLayerArbitrator from '../contracts/ABI/TalentLayerArbitrator.json';
import { useWalletClient } from 'wagmi';
import { ADDRESS_ZERO } from '../config';

const useArbitrationCost = (arbitratorAddress: string | undefined): bigint | null => {
  const [arbitrationCost, setArbitrationCost] = useState<bigint | null>(null);
  const { data: walletClient } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (walletClient && arbitratorAddress && arbitratorAddress !== ADDRESS_ZERO) {
          const talentLayerArbitrator = new Contract(
            arbitratorAddress,
            TalentLayerArbitrator.abi,
            walletClient,
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

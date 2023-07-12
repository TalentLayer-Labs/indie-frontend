import { useState, useEffect, useContext } from 'react';
import { BigNumber, Contract, ethers } from 'ethers';
import TalentLayerArbitrator from '../contracts/ABI/TalentLayerArbitrator.json';
import TalentLayerContext from '../context/talentLayer';

const useArbitrationCost = (arbitratorAddress: string | undefined): BigNumber | null => {
  const { signer } = useContext(TalentLayerContext);
  const [arbitrationCost, setArbitrationCost] = useState<BigNumber | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (signer && arbitratorAddress && arbitratorAddress !== ethers.constants.AddressZero) {
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

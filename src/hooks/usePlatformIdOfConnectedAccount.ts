import { getPlatformId } from '../contracts/getPlatformId';
import { Signer } from 'ethers';
import { Provider } from '@wagmi/core';
import { useEffect, useState } from 'react';

const usePlatformIdOfConnectedAccount = (
  signer: Signer | null | undefined,
  provider: Provider,
): number | null => {
  const [platformId, setPlatformId] = useState<number | null>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    const fetchData = async () => {
      try {
        const platformIdOfConnectedAccount = await getPlatformId(signer, provider);
        if (platformIdOfConnectedAccount) {
          setPlatformId(Number(platformIdOfConnectedAccount));
        }
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    fetchData();
  }, [signer, provider]);

  return platformId;
};

export default usePlatformIdOfConnectedAccount;

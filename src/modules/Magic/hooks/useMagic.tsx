import { useEffect, useState } from 'react';
import { Magic, MagicSDKExtensionsOption } from 'magic-sdk';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';

const useMagic = (): {
  magic: InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | undefined;
  provider: any | undefined;
} => {
  const [magic, setMagic] = useState<
    InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | undefined
  >(undefined);
  const [provider, setProvider] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window !== 'undefined') {
          const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_KEY as string, {
            network: {
              // rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
              rpcUrl: 'https://polygon-mumbai.infura.io/v3/6f07c5b58e32490bbefabd84c55290c7',
              chainId: 80001,
            },
          });
          setMagic(magicInstance);
          setProvider(await magic?.wallet.getProvider());
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return { magic, provider };
};

export default useMagic;

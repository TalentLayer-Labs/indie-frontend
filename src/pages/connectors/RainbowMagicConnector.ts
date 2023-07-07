import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';
import { Chain } from 'wagmi';

// Define the rainbowMagicConnector function that will be used to create the Magic connector
export const rainbowMagicConnector = ({ chains }: { chains: Chain[] }) => ({
  id: 'magic',
  name: 'Magic',
  iconUrl: 'https://svgshare.com/i/pXA.svg',
  iconBackground: 'white',
  createConnector: () => ({
    // This can be replaced with the MagicConnectConnector if you want to use the Magic Connect flow
    connector: new MagicConnectConnector({
      chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_KEY as string,
        isDarkMode: true,
        magicSdkConfiguration: {
          network: {
            rpcUrl: 'https://polygon-mumbai.infura.io/v3/6f07c5b58e32490bbefabd84c55290c7',
            chainId: 80001,
          },
        },
      },
    }),
  }),
});

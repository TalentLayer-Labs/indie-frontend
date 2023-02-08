import { chain } from 'wagmi';

export const customChains = {
  ...chain,
  fuji: {
    id: 43_113,
    name: 'Fuji',
    network: 'fuji',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche',
      symbol: 'AVAX',
    },
    rpcUrls: {
      default: 'https://api.avax-test.network/ext/C/rpc',
    },
    blockExplorers: {
      default: { name: 'testnet.snowTrace', url: 'https://testnet.snowtrace.io/' },
    },
    testnet: false,
  },
};

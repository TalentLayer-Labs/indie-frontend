import { chain } from 'wagmi';

export const customChains = {
  ...chain,
  polygonMumbai: {
    id: 80001,
    name: 'Polygon Mumbai',
    network: 'maticmum',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: 'https://rpc-mumbai.maticvigil.com/',
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://mumbai.polygonscan.com',
      },
    },
    testnet: true,
  },
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
  local: {
    id: 1337,
    name: 'localhost',
    network: 'localhost',
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
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

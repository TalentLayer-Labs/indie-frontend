import { ethers } from 'ethers';
import { IToken, NetworkEnum } from './types';

export type Config = {
  networkId: NetworkEnum;
  escrowConfig: { [key: string]: any };
  contracts: { [key: string]: `0x${string}` };
  tokens: { [key: string]: IToken };
};

export const maxDecimals = {
  ETH: 2,
};

export const FEE_RATE_DIVIDER = 10_000;

const goerli: Config = {
  networkId: NetworkEnum.GOERLI,
  contracts: {
    talentLayerId: '0x67c3AC531084aB5E6E04d4bB0FC7766e27b81546',
    serviceRegistry: '0x6f97FB242d2D3bCA9d19c05c975F6Ec8caB4d1a4',
    talentLayerReview: '0x59ff1f3ff159c17C48558cCf8269FF17aA0B8C8D',
    talentLayerEscrow: '0x4A6F0208a0b636E3A4918cb0A5B1367E4B338aD8',
    talentLayerPlatformId: '0x29AcBBbfAb5e1AF98557C53CCcEF0C050FA18Bc8',
  },
  escrowConfig: {
    timeoutPayment: 3600 * 24 * 7,
  },
  tokens: {
    [ethers.constants.AddressZero]: {
      address: ethers.constants.AddressZero,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    '0x73967c6a0904aa032c103b4104747e88c566b1a2': {
      address: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18,
    },
    '0x07865c6e87b9f70255377e024ace6630c1eaa37f': {
      address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      symbol: 'USDC',
      name: 'USDC Stablecoin',
      decimals: 6,
    },
    '0x652e712fD63D8AcB14FA7d2b2b5aCA0413E8E705': {
      address: '0x652e712fD63D8AcB14FA7d2b2b5aCA0413E8E705',
      symbol: 'SERC20',
      name: 'Simple ERC20',
      decimals: 18,
    },
  },
};

const fuji: Config = {
  networkId: NetworkEnum.FUJI,
  contracts: {
    talentLayerId: '0xD1B87CCe7f9FA272c6643Fa89085F135A2AbB234',
    serviceRegistry: '0x9Af3080e73FB1054896e3799a786F0063965bA46',
    talentLayerReview: '0xc9c87d5b85fd88d375000f9e3e26195690934F50',
    talentLayerEscrow: '0x754278520467fAdBB1D0230E082E436E70505EE2',
    talentLayerPlatformId: '0xC30859CFa06D0cB9D66837feBB36a856BF78865E',
  },
  escrowConfig: {
    adminFee: '0',
    adminWallet: '0x96573C632c88996711de69389b501F4D9005Ff4e',
    timeoutPayment: 3600 * 24 * 7,
  },
  tokens: {
    [ethers.constants.AddressZero]: {
      address: ethers.constants.AddressZero,
      symbol: 'AVAX',
      name: 'Avalanche',
      decimals: 18,
    },
    '0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160': {
      address: '0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160',
      symbol: 'USDC',
      name: 'USDC Stablecoin',
      decimals: 6,
    },
  },
};

const local: Config = {
  networkId: NetworkEnum.LOCAL,
  contracts: {
    talentLayerId: '0x2F9EBAc36cc020B81c4c624AbcfeC7DC8958Cf54',
    serviceRegistry: '0x8E86d82214c391281a908e3e31a766fcb9FaB3cA',
    talentLayerReview: '0x66676968c176aA328124f04f53F8653db6b35ff9',
    talentLayerEscrow: '0x182980458E0F93167Fab56c494776b694A07C030',
    talentLayerPlatformId: '0xc0aB487a8e374807B86291CE5BE4b0dE4540529d',
  },
  escrowConfig: {
    timeoutPayment: 3600 * 24 * 7,
  },
  tokens: {
    [ethers.constants.AddressZero]: {
      address: ethers.constants.AddressZero,
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    '0x67EE2a1f75788794f516b8F9919496D63109A380': {
      address: '0x67EE2a1f75788794f516b8F9919496D63109A380',
      symbol: 'ERC20',
      name: 'Simple ERC20',
      decimals: 18,
    },
  },
};

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local,
  [NetworkEnum.GOERLI]: goerli,
  [NetworkEnum.FUJI]: fuji,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

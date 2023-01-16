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
    talentLayerId: '0x11119eD887aeC1302e2cAF49942F891667A31BBc',
    serviceRegistry: '0xf0EECbBf164D81261C7Ce4D22D16f38DC63fBAbd',
    talentLayerReview: '0xCf7577fB4749fA9Ae38296D52C53C654F9A9367f',
    talentLayerEscrow: '0x34FCF4b0A418011682F6EdC86c49a0Faacc8A667',
    talentLayerPlatformId: '0x08FB56537F118Cf35C4d3eB280444737f6D1bE46',
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
    '0xd80d331d3b6dca0a20f4af2edc9c9645cd1f10c8': {
      address: '0xd80d331d3b6dca0a20f4af2edc9c9645cd1f10c8',
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

const mumbai: Config = {
  networkId: NetworkEnum.MUMBAI,
  contracts: {
    talentLayerId: '0xcfF1C0A9A78512Fb3757fF61fC794d8F77Ee535f',
    serviceRegistry: '0x28409B9A38BF5B0897c08C5812Bd91D9313743AB',
    talentLayerReview: '0xe33725A94e24A6808AA6351551ee96c80736e8Dc',
    talentLayerEscrow: '0x8564BD74CFdcE620F6C89C6d5326614B24CDcbae',
    talentLayerPlatformId: '0x2deB8a32638c99310AD84E3b335e07737F8a61aE',
  },
  escrowConfig: {
    adminFee: '0',
    adminWallet: '0x8564BD74CFdcE620F6C89C6d5326614B24CDcbae',
    timeoutPayment: 3600 * 24 * 7,
  },
  tokens: {
    [ethers.constants.AddressZero]: {
      address: ethers.constants.AddressZero,
      symbol: 'MATIC',
      name: 'Matic',
      decimals: 18,
    },
    '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747': {
      address: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747',
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
  [NetworkEnum.MUMBAI]: mumbai,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

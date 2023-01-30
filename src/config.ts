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
    talentLayerId: '0x2475F87a2A73548b2E49351018E7f6a53D3d35A4',
    serviceRegistry: '0x3dE39C61d4281716c458ffdb3150aa9aF4fb752a',
    talentLayerReview: '0xa3A183D6f70217362050040Ef365923a0c1989e8',
    talentLayerEscrow: '0x91327C01CB952a95addDa72FcA59E4151fE42Cb3',
    talentLayerPlatformId: '0xF39e4249b6dCcca8Ec7455E524C9685d1332fCD1',
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
    '0xfF695df29837B571c4DAE01B5711500f6306E93f': {
      address: '0xfF695df29837B571c4DAE01B5711500f6306E93f',
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

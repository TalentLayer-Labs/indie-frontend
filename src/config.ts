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
    '0x3B25E43c2E07063E6e3A562Fb74b32A0500dF227': {
      address: '0x3B25E43c2E07063E6e3A562Fb74b32A0500dF227',
      symbol: 'SERC20',
      name: 'Simple ERC20',
      decimals: 18,
    },
  },
};

const local = {
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
      symbol: 'ETH',
      name: 'ETH',
      decimals: 18,
    },
    '0x67EE2a1f75788794f516b8F9919496D63109A380': {
      symbol: 'ERC20',
      name: 'Simple ERC20',
      decimals: 18,
    },
  },
};

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local as Config,
  [NetworkEnum.GOERLI]: goerli,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

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
    talentLayerId: '0x20a9A5e013376173C220e9c7AcC8e55137b6C5b1',
    serviceRegistry: '0xfc2560b8DbC0c52537fEC0399B12B0cd343e71bd',
    talentLayerReview: '0xE778f68e279D7b618061E9b0387ab6e87F5AE810',
    talentLayerEscrow: '0xfD06e6F16017Cd32D6E6610B9477169f38B54583',
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
    '0x73967c6a0904aa032c103b4104747e88c566b1a2': {
      symbol: 'DAI',
      name: 'DAI Stablecoin',
      decimals: 18,
    },
    '0x07865c6e87b9f70255377e024ace6630c1eaa37f': {
      symbol: 'USDC',
      name: 'USDC Stablecoin',
      decimals: 6,
    },
    '0xD58e9Cf29fA1d561604F1dC4FCbf41830D769152': {
      symbol: 'SERC20',
      name: 'Simple ERC20',
      decimals: 18,
    },
  },
};

const local = {
  networkId: NetworkEnum.LOCAL,
  contracts: {
    talentLayerId: '0x97aa4622Aeda18CAF5c797C1E5285Bd5c6fc145D',
    serviceRegistry: '0xE5054E2e59B284CA09713418451709E0CEb4116b',
    talentLayerReview: '0x67EE2a1f75788794f516b8F9919496D63109A380',
    talentLayerEscrow: '0xfD06e6F16017Cd32D6E6610B9477169f38B54583',
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

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

const goerli: Config = {
  networkId: NetworkEnum.GOERLI,
  contracts: {
    escrowFactory: '0x3f5f310A63AD54256403586f133D578fCa80B8FC',
  },
  escrowConfig: {
    adminFee: '0',
    adminWallet: '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa',
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
      decimals: 6,
    },
    '0x07865c6e87b9f70255377e024ace6630c1eaa37f': {
      symbol: 'USDC',
      name: 'USDC Stablecoin',
      decimals: 6,
    },
  },
};

const local = {};

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local as Config,
  [NetworkEnum.GOERLI]: goerli,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

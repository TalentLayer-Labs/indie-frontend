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
    TalentLayerMultipleArbitrableTransaction: '0xfD06e6F16017Cd32D6E6610B9477169f38B54583',
    talentLayerPlatformId: '0x319DDC7776024228be0408288B196b81dcaE7383',
    talentLayerArbitrator: '0x05420c52e5f014758ef0faCC9cAB904E75728675',
    // talentLayerId: '0xA05Cc3BF8d883224652B372AbdB344207B548e7A',
    // serviceRegistry: '0x770C25495064AFd1704f94a696Ff148581FaD730',
    // talentLayerReview: '0x22d3Bd4995B47C020D7b1dC0Cde7450cBfcE3c52',
    // TalentLayerMultipleArbitrableTransaction: '0x26066680C88Fc55Db2F2fCc3F6a2F9E94AC64390',
    // talentLayerPlatformId: '0xb9Cd8f33B29b7f793b1E9B7C1b9F30f390e82E78',
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

const local = {};

const chains: { [networkId in NetworkEnum]: Config } = {
  [NetworkEnum.LOCAL]: local as Config,
  [NetworkEnum.GOERLI]: goerli,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

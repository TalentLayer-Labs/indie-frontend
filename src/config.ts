import { ethers } from 'ethers';
import { IToken, NetworkEnum } from './types';

export type Config = {
  networkId: NetworkEnum;
  subgraphUrl: string;
  contracts: { [key: string]: `0x${string}` };
  tokens: { [key: string]: IToken };
};

export const maxDecimals = {
  ETH: 2,
};

export const FEE_RATE_DIVIDER = 10_000;

const polygon: Config = {
  networkId: NetworkEnum.POLYGON,
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talentlayer-polygon',
  contracts: {
    talentLayerId: '0xD7D1B2b0A665F03618cb9a45Aa3070f789cb91f2',
    serviceRegistry: '0xae8Bba1a403816568230d92099ccB87f41BbcA78',
    talentLayerReview: '0x7bBC20c8Fcb75A126810161DFB1511f6D3B1f2bE',
    talentLayerEscrow: '0x21C716673897f4a2A3c12053f3973F51Ce7b0cf6',
    talentLayerPlatformId: '0x09FF07297d48eD9aD870caCE4b33BF30869C1D17',
    talentLayerArbitrator: '0x4502E695A747F1b382a16D6C8AE3FD94DA78e7a0',
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

const mumbai: Config = {
  networkId: NetworkEnum.MUMBAI,
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-mumbai',
  contracts: {
    talentLayerId: '0x3F87289e6Ec2D05C32d8A74CCfb30773fF549306',
    serviceRegistry: '0x27ED516dC1df64b4c1517A64aa2Bb72a434a5A6D',
    talentLayerReview: '0x050F59E1871d3B7ca97e6fb9DCE64b3818b14B18',
    talentLayerEscrow: '0x4bE920eC3e8552292B2147480111063E0dc36872',
    talentLayerPlatformId: '0xEFD8dbC421380Ee04BAdB69216a0FD97F64CbFD4',
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
  subgraphUrl: 'http://localhost:8020/',
  contracts: {
    talentLayerId: '0x2475F87a2A73548b2E49351018E7f6a53D3d35A4',
    serviceRegistry: '0x3dE39C61d4281716c458ffdb3150aa9aF4fb752a',
    talentLayerReview: '0xa3A183D6f70217362050040Ef365923a0c1989e8',
    talentLayerEscrow: '0x91327C01CB952a95addDa72FcA59E4151fE42Cb3',
    talentLayerPlatformId: '0xF39e4249b6dCcca8Ec7455E524C9685d1332fCD1',
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
  [NetworkEnum.MUMBAI]: mumbai,
  [NetworkEnum.POLYGON]: polygon,
};

export const config = chains[+import.meta.env.VITE_NETWORK_ID as NetworkEnum];

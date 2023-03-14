import { ethers } from 'ethers';
import { IToken, NetworkEnum } from './types';

export type Config = {
  networkId: NetworkEnum;
  subgraphUrl: string;
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
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-protocol',
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
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/talentlayer/talent-layer-fuji',
  contracts: {
    talentLayerId: '0x9a76eA2C056B6Bee5A1179BBece77D28FceE48C4',
    serviceRegistry: '0x9EA2678d5A69CEDEc52ecafA367659b1d2Ff7824',
    talentLayerReview: '0xD8c4fD1D8Dd2f3a6E4d26BeB167e73D9E28db7F0',
    talentLayerEscrow: '0x8754a129D3F53222dd94Ce45749134c15C9Ed119',
    talentLayerPlatformId: '0x8799479a39b6e563969126328e2323cbA01e8742',
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
  subgraphUrl: 'https://api.thegraph.com/subgraphs/name/akugone/aku-mumbai-talent-layer',
  contracts: {
    talentLayerId: '0x0CB10e5E4573de1411c4b007FEa96FBae26c3821',
    serviceRegistry: '0x72C7a016320e9709fC4873110C1c3a1a25510774',
    talentLayerReview: '0x6402e7bEaeD1f580F78942fac4466D758689e0CE',
    talentLayerEscrow: '0x0fD26c83016C15e9cc9a8907BbE248164C114F7f',
    talentLayerPlatformId: '0x1767Fba47BBdd8Bdc99A3Ea083992dE6c6a8e1B1',
  },
  escrowConfig: {
    adminFee: '0',
    adminWallet: '0xC01FcDfDE3B2ABA1eab76731493C617FfAED2F10',
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
  subgraphUrl: 'http://localhost:8000/subgraphs/name/talentlayer/talent-layer-protocol',
  contracts: {
    talentLayerId: '0xf584E555B68EC5980D6B606Ae2EaafF512A9d6C9',
    serviceRegistry: '0xdF8D3ED1E1C448c2BD290C7d45d8041E4e2aEc45',
    talentLayerReview: '0xE78D331040386585529BfB379e66F39DF04a235F',
    talentLayerEscrow: '0x91fBda7cCdD683D061d3137A15F96aaf66AD36B3',
    talentLayerPlatformId: '0xa5BA0CCB83A45b4E5c85b41649F80ed7DAFD6e28',
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

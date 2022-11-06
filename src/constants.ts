import { Token } from './types';

export const CONST = {
  DAI_ADDRESS: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
  USDC_ADDRESS: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  ETH_ADDRESS: '0x0000000000000000000000000000000000000000',
  KLEROS_TRANSACTION_TIMEOUT_PAYMENT: 3600 * 24 * 7,
  KLEROS_TRANSACTION_ADMIN_FEE: '0',
  KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS: '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa',
};

export const TOKENS: { [key: string]: Token } = {
  [CONST.DAI_ADDRESS]: {
    symbol: 'DAI',
    name: 'DAI Stablecoin',
    decimals: 6,
    address: CONST.DAI_ADDRESS,
  },
  [CONST.USDC_ADDRESS]: {
    symbol: 'USDC',
    name: 'USDC Stablecoin',
    decimals: 6,
    address: CONST.USDC_ADDRESS,
  },
  [CONST.ETH_ADDRESS]: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: CONST.ETH_ADDRESS,
  },
};

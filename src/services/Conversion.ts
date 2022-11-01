import { CONST } from '../constants';
import { ProposalType } from '../types';

export const renderToken = (tokenAddress: string): string => {
  let result = '';
  switch (tokenAddress) {
    case CONST.DAI_ADDRESS:
      result = CONST.DAI_SYMBOL;
      break;
    case CONST.ETH_ADDRESS:
      result = CONST.ETH_SYMBOL;
      break;
    case CONST.USDC_ADDRESS:
      result = CONST.USDC_SYMBOL;
      break;
    default:
      // eslint-disable-next-line no-console
      console.error('Missing token!');
      result = '';
      break;
  }
  return result;
};

export const renderRateUnit = (typeId: string) => {
  return 'Flat';
};

export const renderRateType = (typeId: string) => {
  return `Flat rate payment`;
};

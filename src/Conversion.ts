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
  // let returnValue = '';
  // switch (typeId) {
  //   case ProposalType.Hourly.toString():
  //     returnValue = '/hourly';
  //     break;
  //   case ProposalType.Flat.toString():
  //     returnValue = 'Flat';
  //     break;
  //   case ProposalType.Milestone.toString():
  //     returnValue = '/Milestone';
  //     break;
  //   default:
  //     // eslint-disable-next-line no-console
  //     console.error('No rate type !');
  //     break;
  // }
  // return returnValue;
  // TODO: Uncomment when rateType is implemented in contracts & the graph
  return 'Flat';
};

export const renderRateType = (typeId: string) => {
  // TODO: Uncomment when rateType is implemented in contracts & the graph
  return `Flat rate payment`;
  // return `${ProposalType[Number(typeId)]} rate payment`;
};

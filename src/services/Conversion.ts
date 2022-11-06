import { ethers } from 'ethers';
import { TOKENS } from '../constants';

export const renderTokenAmount = (tokenAddress: string, value: string): string => {
  if (TOKENS[tokenAddress] === undefined) {
    return 'unknown token';
  }
  const symbol = TOKENS[tokenAddress].symbol;
  const formattedValue = ethers.utils.formatUnits(value, TOKENS[tokenAddress].decimals);
  return `${formattedValue} ${symbol}`;
};

export const renderRateUnit = (typeId: string) => {
  return 'Flat';
};

export const renderRateType = (typeId: string) => {
  return `Flat rate payment`;
};

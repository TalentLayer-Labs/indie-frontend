import { ethers } from 'ethers';
import { config } from '../config';

export const renderTokenAmount = (tokenAddress: string, value: string): string => {
  if (config.tokens[tokenAddress] === undefined) {
    return 'unknown token';
  }
  if (!value) {
    return '';
  }
  const symbol = config.tokens[tokenAddress].symbol;
  const formattedValue = ethers.utils.formatUnits(value, config.tokens[tokenAddress].decimals);
  return `${formattedValue} ${symbol}`;
};

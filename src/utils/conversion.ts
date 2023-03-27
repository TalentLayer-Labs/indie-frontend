import { ethers } from 'ethers';
import { config } from '../config';
import { IToken } from '../types';

export const renderTokenAmount = (token: IToken, value: string): string => {
  const formattedValue = ethers.utils.formatUnits(value, token.decimals);
  return `${formattedValue} ${token.symbol}`;
};

// TODO: query tokens list from graph
export const renderTokenAmountFromConfig = (tokenAddress: string, value: string): string | null => {
  if (config.tokens[tokenAddress] === undefined || !value) {
    return null;
  }
  const symbol = config.tokens[tokenAddress].symbol;
  const formattedValue = ethers.utils.formatUnits(value, config.tokens[tokenAddress].decimals);
  return `${formattedValue} ${symbol}`;
};

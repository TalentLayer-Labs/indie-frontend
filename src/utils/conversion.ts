import { formatUnits } from 'viem';
import { config } from '../config';
import { IToken } from '../types';

export const renderTokenAmount = (token: IToken, value: bigint): string => {
  const formattedValue = formatUnits(value, token.decimals);
  return `${formattedValue} ${token.symbol}`;
};

// TODO: query tokens list from graph
export const renderTokenAmountFromConfig = (tokenAddress: string, value: bigint): string | null => {
  if (config.tokens[tokenAddress] === undefined || !value) {
    return null;
  }
  const symbol = config.tokens[tokenAddress].symbol;
  const formattedValue = formatUnits(value, config.tokens[tokenAddress].decimals);
  return `${formattedValue} ${symbol}`;
};

import { ethers } from 'ethers';
import { config } from '../config';

/**
 * Check if token is supported
 */
export const isTokenSupported = (tokenAddress: string): boolean => {
  return config.tokens[tokenAddress] !== undefined;
};

/**
 * Convert token amount from wei to token unit
 */
export const getTokenAmount = (tokenAddress: string, value: string): string => {
  if (!isTokenSupported(tokenAddress)) {
    console.error(`Token ${tokenAddress} is not supported`);
    return 'unknown token';
  }
  return ethers.utils.formatUnits(value, config.tokens[tokenAddress].decimals);
};

/**
 * Render token amount with symbol
 */
export const renderTokenAmount = (tokenAddress: string, value: string): string => {
  if (!isTokenSupported(tokenAddress)) {
    console.error(`Token ${tokenAddress} is not supported`);
    return 'unknown token';
  }
  const symbol = config.tokens[tokenAddress].symbol;
  const formattedValue = getTokenAmount(tokenAddress, value);
  return `${formattedValue} ${symbol}`;
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

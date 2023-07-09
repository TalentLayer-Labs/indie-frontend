import { ITokenFormattedValues } from '../types';
import { ADDRESS_ZERO } from '../config';
import { formatEther, formatUnits, parseEther, parseUnits } from 'viem';

export const parseRateAmount = async (
  rateAmount: string,
  rateToken: string,
  decimals?: number,
): Promise<bigint> => {
  if (rateToken === ADDRESS_ZERO) {
    return parseEther(rateAmount);
  }
  return parseUnits(rateAmount, decimals || 18);
};

export const formatRateAmount = (
  rateAmount: bigint,
  rateToken: string,
  tokenDecimals: number,
): ITokenFormattedValues => {
  if (rateToken === ADDRESS_ZERO) {
    const valueInEther = formatEther(rateAmount);
    const roundedValue = FixedNumber.from(valueInEther).round(2).toString();
    const exactValue = FixedNumber.from(valueInEther).toString();
    return {
      roundedValue,
      exactValue,
    };
  }
  const valueInToken = formatUnits(rateAmount, tokenDecimals);
  const roundedValue = FixedNumber.from(valueInToken).round(2).toString();
  const exactValue = FixedNumber.from(valueInToken).toString();
  return {
    roundedValue,
    exactValue,
  };
};

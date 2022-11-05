import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';
import { BigNumber, ethers, FixedNumber, Signer } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import ERC20 from '../contracts/ERC20.json';
import { CONST } from '../constants';
import { TokenFormattedValues } from '../types';

export default function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

const getDecimal = async (erc20Token: Contract): Promise<string> => {
  if (!sessionStorage[erc20Token.address]) {
    const tokenDecimals = await erc20Token.decimals();
    sessionStorage[erc20Token.address] = tokenDecimals;
    return tokenDecimals;
  }
  return JSON.parse(sessionStorage[erc20Token.address]);
};

export const parseRateAmount = async (
  rateAmount: string,
  rateToken: string,
  signer: ethers.Signer,
): Promise<BigNumber> => {
  if (rateToken === CONST.ETH_ADDRESS) {
    return ethers.utils.parseEther(rateAmount);
  }
  const ERC20Token = new Contract(rateToken, ERC20.abi, signer);
  const tokenDecimals = await getDecimal(ERC20Token);

  return ethers.utils.parseUnits(rateAmount, tokenDecimals);
};

export const formatRateAmount = async (
  rateAmount: string,
  rateToken: string,
  signer: Signer,
): Promise<TokenFormattedValues> => {
  if (rateToken === CONST.ETH_ADDRESS) {
    const valueInEther = ethers.utils.formatEther(rateAmount);
    const roundedValue = FixedNumber.from(valueInEther).round(2).toString();
    const exactValue = FixedNumber.from(valueInEther).toString();
    return {
      roundedValue,
      exactValue,
    };
  }
  const ERC20Token = new Contract(rateToken, ERC20.abi, signer);
  const tokenDecimals = await getDecimal(ERC20Token);

  const valueInToken = ethers.utils.formatUnits(rateAmount, tokenDecimals);
  const roundedValue = FixedNumber.from(valueInToken).round(2).toString();
  const exactValue = FixedNumber.from(valueInToken).toString();
  return {
    roundedValue,
    exactValue,
  };
};

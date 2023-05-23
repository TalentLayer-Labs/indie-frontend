import { BigNumber, Contract, Signer } from 'ethers';
import { Provider } from '@wagmi/core';
import { config } from '../config';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';

export const executePayment = async (
  signer: Signer,
  provider: Provider,
  profileId: string,
  transactionId: string,
  amount: BigNumber,
  isBuyer: boolean,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    signer,
  );
};

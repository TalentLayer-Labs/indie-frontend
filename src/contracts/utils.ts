import { Contract } from '@ethersproject/contracts';
import { ethers, Signer } from 'ethers';
import { config } from '../config/app';
import TalentLayerIDABI from './TalentLayerID.json';
import TalentLayerReview from './TalentLayerReview.json';
import ServiceRegistry from './ServiceRegistry.json';
import TalentLayerMultipleArbitrableTransaction from './TalentLayerMultipleArbitrableTransaction.json';
import ERC20 from './ERC20.json';
import { CONST } from '../constants';
import { parseRateAmount } from '../services/web3';

const platformId = process.env.REACT_APP_PLATFORMID as string;

export const checkHandleUniqueness = async (
  signer: Signer | null,
  newHandle?: string,
): Promise<boolean> => {
  if (!newHandle || !signer) {
    return false;
  }
  const talentLayerID = new Contract(config.talentLayerIdAddress, TalentLayerIDABI.abi, signer);
  const isHandleTaken = await talentLayerID.takenHandles(newHandle);
  return !isHandleTaken;
};

export const mint = async (
  signer: Signer,
  handle: string,
  isRegisterToPoh: boolean | null,
): Promise<string> => {
  const talentLayerID = new Contract(config.talentLayerIdAddress, TalentLayerIDABI.abi, signer);
  let id;

  if (isRegisterToPoh) {
    id = await talentLayerID.mintWithPoh(platformId, handle);
  } else {
    id = await talentLayerID.mint(platformId, handle);
  }
  return id;
};

export const createProposal = async (
  signer: Signer,
  serviceId: string,
  rateToken: string,
  rateAmount: string,
  uri: string,
): Promise<string> => {
  const parsedRateAmount = await parseRateAmount(rateAmount, rateToken, signer);
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  const proposalId = await serviceRegistry.createProposal(
    serviceId,
    rateToken,
    parsedRateAmount,
    uri,
  );
  return proposalId;
};

// In the smart contracts, the proposal ID is represented by the seller ID. We pass sellerId as an input here, not proposalId.
export const acceptProposal = async (
  signer: Signer,
  serviceId: string,
  sellerId: string,
  rateAmount: string,
  rateToken: string,
): Promise<void> => {
  const talentLayerMultipleArbitrableTransaction = new Contract(
    config.talentLayerMultipleArbitrableTransactionAddress,
    TalentLayerMultipleArbitrableTransaction.abi,
    signer,
  );

  if (rateToken === CONST.ETH_ADDRESS) {
    const value = ethers.utils
      .parseUnits(rateAmount, 'wei')
      .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 'wei'));

    await talentLayerMultipleArbitrableTransaction.createETHTransaction(
      CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
      'meta_evidence',
      CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
      CONST.KLEROS_TRANSACTION_ADMIN_FEE,
      parseInt(serviceId, 10),
      parseInt(sellerId, 10),
      {
        value,
        gasLimit: 5000000,
      },
    );
  } else {
    // Token transfer approval for escrow contract
    const ERC20Token = new Contract(rateToken, ERC20.abi, signer);
    const value = ethers.utils
      .parseUnits(rateAmount, 0)
      // unitName is set to "0" to parse to smallest unit of token
      .add(ethers.utils.parseUnits(CONST.KLEROS_TRANSACTION_ADMIN_FEE, 0));

    await ERC20Token.approve(config.talentLayerMultipleArbitrableTransactionAddress, value);
    await talentLayerMultipleArbitrableTransaction.createTokenTransaction(
      CONST.KLEROS_TRANSACTION_TIMEOUT_PAYMENT,
      'meta_evidence',
      CONST.KLEROS_TRANSACTION_ADMIN_WALLET_ADDRESS,
      CONST.KLEROS_TRANSACTION_ADMIN_FEE,
      parseInt(serviceId, 10),
      parseInt(sellerId, 10),
      {
        gasLimit: 5000000,
      },
    );
  }
};

export const rejectProposal = async (
  signer: Signer,
  serviceId: string,
  sellerId: string,
): Promise<void> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  await serviceRegistry.rejectProposal(serviceId, sellerId);
};

export const createServiceFromBuyer = async (
  signer: Signer,
  sellerId: string,
  serviceDataUri: string,
): Promise<string> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  const serviceId = await serviceRegistry.createServiceFromBuyer(
    platformId,
    sellerId,
    serviceDataUri,
  );
  return serviceId;
};

export const createServiceFromSeller = async (
  signer: Signer,
  sellerId: string,
  serviceDataUri: string,
): Promise<string> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  const serviceId = await serviceRegistry.createServiceFromSeller(
    platformId,
    sellerId,
    serviceDataUri,
  );
  return serviceId;
};

export const createOpenServiceFromBuyer = async (
  signer: Signer,
  serviceDataUri: string,
): Promise<string> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  const serviceId = await serviceRegistry.createOpenServiceFromBuyer(platformId, serviceDataUri);
  return serviceId;
};

export const confirmService = async (signer: Signer, serviceId: string): Promise<void> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  await serviceRegistry.confirmService(serviceId);
};

export const finishService = async (signer: Signer, serviceId: string): Promise<void> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  await serviceRegistry.finishService(serviceId);
};

export const rejectService = async (signer: Signer, serviceId: string): Promise<void> => {
  const serviceRegistry = new Contract(config.serviceRegistryAddress, ServiceRegistry.abi, signer);
  await serviceRegistry.rejectService(serviceId);
};

export const addReview = async (
  signer: Signer,
  serviceId: string,
  rating: number,
  reviewUri: string,
): Promise<void> => {
  const talentLayerReview = new Contract(
    config.talentLayerReviewAddress,
    TalentLayerReview.abi,
    signer,
  );
  await talentLayerReview.addReview(serviceId, reviewUri, rating, platformId);
};

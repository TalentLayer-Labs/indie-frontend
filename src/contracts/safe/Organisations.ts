import SafeApiKit from '@safe-global/api-kit';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { OperationType, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';

// This file can be used to play around with the Safe Core SDK

export async function deploySafe(
  members: string[],
  signer: ethers.Signer,
  threshold = 1,
): Promise<string | undefined> {
  if (!signer) return;
  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  // Create SafeFactory instance
  const safeFactory = await SafeFactory.create({ ethAdapter });

  // Config of the deployed Safe
  const safeAccountConfig: SafeAccountConfig = {
    owners: members,
    threshold: threshold,
  };

  //TODO check if this is compulsory
  const saltNonce = Date.now().toString();

  // Predict deployed address
  const predictedDeploySafeAddress = await safeFactory.predictSafeAddress(
    safeAccountConfig,
    saltNonce,
  );

  console.log('Predicted deployed Safe address:', predictedDeploySafeAddress);

  function callback(txHash: string) {
    console.log('Transaction hash:', txHash);
  }

  // Deploy Safe
  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce,
    callback,
  });

  console.log('Deployed Safe:', await safe.getAddress());
  return safe.getAddress();
}

export async function proposeSafeTransaction(
  safeAddress: string,
  toAddress: string,
  signer: ethers.Signer,
  value = '0',
  data = '',
): Promise<string | undefined> {
  if (!signer) return;

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  // Create Safe instance
  const safe = await Safe.create({
    ethAdapter,
    safeAddress: safeAddress,
  });

  // Create Safe API Kit instance
  const service = new SafeApiKit({
    txServiceUrl: process.env.NEXT_PUBLIC_SAFE_API_URL as string,
    ethAdapter,
  });

  // Create transaction
  const safeTransactionData: SafeTransactionDataPartial = {
    to: toAddress,
    value: value, // 1 wei
    data: data,
    operation: OperationType.Call,
  };

  const safeTransaction = await safe.createTransaction({ safeTransactionData });

  const senderAddress = await signer.getAddress();
  const safeTxHash = await safe.getTransactionHash(safeTransaction);
  const signature = await safe.signTransactionHash(safeTxHash);

  // Propose transaction to the service
  await service.proposeTransaction({
    safeAddress: safeAddress,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signature.data,
  });

  return safeTxHash;
}

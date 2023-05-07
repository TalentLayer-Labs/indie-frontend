// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const { userId } = query;
  let newSigner: ethers.Signer;

  const delegateSeedPhrase = process.env.NEXT_PRIVATE_SEED_PHRASE;

  const delegateWallet = Wallet.fromMnemonic(delegateSeedPhrase as string);
  const delegateProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const delegateSigner = delegateWallet.connect(delegateProvider);

  res.status(200).json({ delegateSigner });
}

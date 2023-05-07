// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import TalentLayerService from '../../contracts/ABI/TalentLayerService.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, platformId, cid, signature } = req.body;
  let signer;

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    const delegateSeedPhrase = process.env.NEXT_PRIVATE_SEED_PHRASE;

    if (!delegateSeedPhrase) {
      res.status(500).json('Delegate seed phrase is not set');
      return;
    }

    const talentLayerContract = new Contract(
      config.contracts.talentLayerId,
      TalentLayerID.abi,
      signer,
    );
    const isDelegate = await talentLayerContract.isDelegate(userId);

    if (isDelegate) {
      signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);
    } else {
      signer = provider.getSigner(userId);
    }

    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      signer,
    );

    const transaction = await serviceRegistryContract.createService(
      userId,
      platformId,
      cid,
      signature,
    );

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    res.status(500).json('tx failed');
  }
}

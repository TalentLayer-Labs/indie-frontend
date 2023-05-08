// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import TalentLayerService from '../../contracts/ABI/TalentLayerService.json';
import { useProvider } from 'wagmi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, platformId, cid, signature } = req.body;
  let signer;

  // TODO : check if user is a real user / call client API

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const delegateSeedPhrase = process.env.NEXT_PRIVATE_SEED_PHRASE;

    console.log('delegateSeedPhrase', delegateSeedPhrase);
    console.log('providerDebug', provider);

    if (!delegateSeedPhrase) {
      res.status(500).json('Delegate seed phrase is not set');
      return;
    }

    signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);
    console.log('signer', signer);

    const talentLayerContract = new Contract(
      config.contracts.talentLayerId,
      TalentLayerID.abi,
      signer,
    );

    console.log('userId', userId);
    console.log('signer.address', signer.address);

    const isDelegate = await talentLayerContract.isDelegate(userId, signer.address);

    console.log('isDelegateDebug', isDelegate);
    if (!isDelegate) {
      res.status(500).json('User is not a delegate');
      return;
    }

    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      signer,
    );
    console.log('serviceRegistryContract', serviceRegistryContract);

    const transaction = await serviceRegistryContract.createService(
      userId,
      platformId,
      cid,
      signature,
    );
    console.log('transactionDebug', transaction);

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

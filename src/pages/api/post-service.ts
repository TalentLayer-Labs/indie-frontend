// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerService from '../../contracts/ABI/TalentLayerService.json';
import { getUserByAddress } from '../../queries/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, userAddress, platformId, cid, signature } = req.body;

  let signer;

  // TODO : you can add here all the check you need to confirm the delagation for a user

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const delegateSeedPhrase = process.env.NEXT_PRIVATE_SEED_PHRASE;

    if (!delegateSeedPhrase) {
      res.status(500).json('Delegate seed phrase is not set');
      return;
    }

    signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);

    const getUser = await getUserByAddress(userAddress);
    const delegateAddresses = getUser.data?.data?.users[0].delegates;
    if (delegateAddresses.indexOf(config.delegation.address.toLowerCase()) === -1) {
      res.status(500).json('Delagation is not activated');
      return;
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
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import TalentLayerService from '../../contracts/ABI/TalentLayerService.json';
import { getUserByAddress } from '../../queries/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user, platformId, cid, signature } = req.body;
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

    const talentLayerContract = new Contract(
      config.contracts.talentLayerId,
      TalentLayerID.abi,
      signer,
    );

    console.log('user.address', user.address);

    const response = await getUserByAddress(user.address);
    console.log('response', response.data?.data?.users[0].delegates);

    const delegateArray = response.data?.data?.users[0].delegates;
    console.log('signer.address', signer.address);

    // check if signer is in the delegate array
    if (delegateArray && delegateArray.includes(signer.address.toString())) {
      console.log('Signer is in the delegate array');
    } else {
      console.log('Signer is not in the delegate array');
      res.status(401).json('Unauthorized');
      return;
    }

    const serviceRegistryContract = new Contract(
      config.contracts.serviceRegistry,
      TalentLayerService.abi,
      signer,
    );

    // const transaction = await serviceRegistryContract.createService(
    //   user.id,
    //   platformId,
    //   cid,
    //   signature,
    // );

    // res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

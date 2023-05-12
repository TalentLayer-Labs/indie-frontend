// pages/api/createService.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Contract, ethers, Wallet } from 'ethers';
import { config } from '../../config';
import TalentLayerEscrow from '../../contracts/ABI/TalentLayerEscrow.json';
import { getUserByAddress } from '../../queries/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userAddress, profileId, transactionId, amount, isBuyer } = req.body;

  let signer;

  // @dev : you can add here all the check you need to confirm the delagation for a user

  try {
    if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE !== 'true') {
      res.status(500).json('Delegation is not activated');
      return;
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_BACKEND_RPC_URL);
    const delegateSeedPhrase = process.env.NEXT_PRIVATE_DELEGATE_SEED_PHRASE;
    const getUser = await getUserByAddress(userAddress);
    const delegateAddresses = getUser.data?.data?.users[0].delegates;
    let transaction;

    if (!delegateSeedPhrase) {
      res.status(500).json('Delegate seed phrase is not set');
      return;
    }
    signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);

    if (delegateAddresses.indexOf(config.delegation.address.toLowerCase()) === -1) {
      res.status(500).json('Delegation is not activated');
      return;
    }

    const talentLayerEscrow = new Contract(
      config.contracts.talentLayerEscrow,
      TalentLayerEscrow.abi,
      signer,
    );

    if (isBuyer) {
      transaction = await talentLayerEscrow.release(profileId, transactionId, amount);
    } else {
      transaction = await talentLayerEscrow.reimburse(profileId, transactionId, amount);
    }

    res.status(200).json({ transaction: transaction });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json('tx failed');
  }
}

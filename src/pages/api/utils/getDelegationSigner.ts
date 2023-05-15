import { NextApiResponse } from 'next';
import { ethers, Wallet } from 'ethers';
import { config } from '../../../config';
import { getUserByAddress } from '../../../queries/users';

export async function handleDelegateActivation(
  userAddress: string,
  res: NextApiResponse,
): Promise<Wallet | null> {
  if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE !== 'true') {
    res.status(500).json('Delegation is not activated');
    return null;
  }

  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_BACKEND_RPC_URL);
  const delegateSeedPhrase = process.env.NEXT_PRIVATE_DELEGATE_SEED_PHRASE;
  const getUser = await getUserByAddress(userAddress);
  const delegateAddresses = getUser.data?.data?.users[0].delegates;

  if (!delegateSeedPhrase) {
    res.status(500).json('Delegate seed phrase is not set');
    return null;
  }

  const signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);

  if (delegateAddresses.indexOf(config.delegation.address.toLowerCase()) === -1) {
    res.status(500).json('Delegation is not activated');
    return null;
  }

  return signer;
}

import { NextApiResponse } from 'next';
import { ethers, Wallet } from 'ethers';
import { config } from '../../../config';
import { getUserByAddress } from '../../../queries/users';

export async function handleDelegateActivation(
  userAddress: string,
  res: NextApiResponse,
): Promise<Wallet | null> {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_BACKEND_RPC_URL);
  const delegateSeedPhrase = process.env.NEXT_PRIVATE_DELEGATE_SEED_PHRASE;
  const getUser = await getUserByAddress(userAddress);
  const delegateAddresses = getUser.data?.data?.users[0].delegates;

  if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE !== 'true') {
    res.status(500).json('Delegation is not activated');
    return null;
  }

  if (!delegateSeedPhrase) {
    res.status(500).json('Delegate seed phrase is not set');
    return null;
  }

  if (delegateAddresses.indexOf(config.delegation.address.toLowerCase()) === -1) {
    res.status(500).json('Delegation is not activated');
    return null;
  }

  const signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);

  return signer;
}

export async function handleDelegateForMint(res: NextApiResponse): Promise<Wallet | null> {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_BACKEND_RPC_URL);
  const delegateSeedPhrase = process.env.NEXT_PRIVATE_DELEGATE_SEED_PHRASE;

  console.log(process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT);

  if (process.env.NEXT_PUBLIC_ACTIVE_DELEGATE_MINT !== 'true') {
    res.status(500).json('Delegation is not activated');
    return null;
  }

  if (!delegateSeedPhrase) {
    res.status(500).json('Delegate seed phrase is not set');
    return null;
  }

  const signer = Wallet.fromMnemonic(delegateSeedPhrase).connect(provider);

  return signer;
}

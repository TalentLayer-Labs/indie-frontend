import { NextApiResponse } from 'next';
import { getUserByAddress } from '../../../queries/users';
import { createPublicClient } from 'viem';

export async function isPlatformAllowedToDelegate(
  userAddress: string,
  res: NextApiResponse,
): Promise<boolean> {
  const getUser = await getUserByAddress(userAddress);
  const delegateAddresses = getUser.data?.data?.users[0].delegates;

  if (
    delegateAddresses.indexOf(
      (process.env.NEXT_PUBLIC_DELEGATE_ADDRESS as string).toLowerCase(),
    ) === -1
  ) {
    res.status(500).json('Delegation is not activated');
    return false;
  }

  return true;
}

export async function getDelegationSigner(res: NextApiResponse): Promise<Wallet | null> {
  const publicClient = createPublicClient({ transport: process.env.NEXT_PUBLIC_BACKEND_RPC_URL });
  const delegateSeedPhrase = process.env.NEXT_PRIVATE_DELEGATE_SEED_PHRASE;

  if (!delegateSeedPhrase) {
    res.status(500).json('Delegate seed phrase is not set');
    return null;
  }

  const walletClient = Wallet.fromMnemonic(delegateSeedPhrase).connect(publicClient);

  return walletClient;
}

import { NextApiResponse } from 'next';

export async function getIexecPrivateKey(res: NextApiResponse): Promise<string | null> {
  const iexecPrivateKey = process.env.NEXT_PRIVATE_IEXEC_PRIVATE_KEY;

  if (!iexecPrivateKey) {
    res.status(500).json('Delegate seed phrase is not set');
    return null;
  }

  return iexecPrivateKey;
}

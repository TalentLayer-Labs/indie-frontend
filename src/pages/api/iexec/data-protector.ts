import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import { IExecDataProtector, getWeb3Provider } from '@iexec/dataprotector';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const privateKey = await getIexecPrivateKey(res);

    if (!privateKey) {
      throw new Error('Private key is not set');
    }
    const web3Provider = getWeb3Provider(privateKey);
    const dataProtector = new IExecDataProtector(web3Provider);

    console.log('dataProtector', dataProtector);

    res.status(200).json({ dataProtector: dataProtector });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

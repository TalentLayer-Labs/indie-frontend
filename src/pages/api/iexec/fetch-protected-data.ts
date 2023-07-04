import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import {
  FetchProtectedDataParams,
  IExecDataProtector,
  getWeb3Provider,
} from '@iexec/dataprotector';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const privateKey = await getIexecPrivateKey(res);

    if (!privateKey) {
      throw new Error('Private key is not set');
    }
    const web3Provider = getWeb3Provider(privateKey);
    const dataProtector = new IExecDataProtector(web3Provider);

    const fetchProtectedDataArg: FetchProtectedDataParams = req.body;

    // We revoke access to the data
    const fetchProtectedData = await dataProtector.fetchProtectedData(fetchProtectedDataArg);
    console.log('Granted access:', fetchProtectedData);

    res.status(200).json({
      message: 'Fetch protected data successfully',
      data: { RevokeAccess: fetchProtectedData },
    });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}
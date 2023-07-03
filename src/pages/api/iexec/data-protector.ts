import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import { IExecDataProtector, ProtectDataParams, getWeb3Provider } from '@iexec/dataprotector';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const privateKey = await getIexecPrivateKey(res);

    if (!privateKey) {
      throw new Error('Private key is not set');
    }
    const web3Provider = getWeb3Provider(privateKey);
    const dataProtector = new IExecDataProtector(web3Provider);

    const protectDataArgs: ProtectDataParams = req.body;
    const protectedData = await dataProtector.protectData(protectDataArgs);

    console.log('Protected data:', protectedData);

    res.status(200).json({ message: 'Data protected successfully', data: protectedData });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

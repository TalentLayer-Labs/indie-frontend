import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import { IExecWeb3mail, getWeb3Provider } from '@iexec/web3mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const privateKey = await getIexecPrivateKey(res);

    if (!privateKey) {
      throw new Error('Private key is not set');
    }
    const web3Provider = getWeb3Provider(privateKey);
    const web3mail = new IExecWeb3mail(web3Provider);

    const fetchMailContacts = await web3mail.fetchMyContacts();

    console.log('web3mail', fetchMailContacts);

    res.status(200).json({ message: 'Email fetch successfully', data: fetchMailContacts });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import {
  GrantAccessParams,
  IExecDataProtector,
  ProtectDataParams,
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

    // We protect the data
    const protectDataArgs: ProtectDataParams = req.body;
    const protectedData = await dataProtector.protectData(protectDataArgs);
    console.log('Protected data:', protectedData);

    /* The address zero `0x0000000000000000000000000000000000000000` can be use to authorize any user to use the `protectedData` */
    const authorizedUser = '0x0000000000000000000000000000000000000000';
    const authorizedApp = process.env.NEXT_PUBLIC_MAIL_AUTHORIZE_APP_ADDRESS;

    if (!authorizedApp) {
      throw new Error('Authorized app is not set');
    }

    const grantAccessArgs: GrantAccessParams = {
      protectedData: protectedData.address,
      authorizedApp,
      authorizedUser,
    };

    // We grant the access to the data
    const grantedAccess = await dataProtector.grantAccess(grantAccessArgs);

    res.status(200).json({
      message: 'Data protected and access granted successfully',
      data: { protectedData: protectedData, AccessGranted: grantedAccess },
    });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

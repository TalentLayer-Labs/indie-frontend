import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../../../modules/Iexec/utils/iexec-private';
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

    /* You can use the `0x0000000000000000000000000000000000000000` can be use to authorize any user to use the `protectedData` */
    const authorizedUser = web3Provider.address;
    console.log('Address:', authorizedUser);
    const authorizedApp = process.env.NEXT_PUBLIC_MAIL_AUTHORIZE_APP_ADDRESS;

    if (!authorizedApp) {
      throw new Error('Authorized app is not set');
    }

    // we directly grant the access to the data to the authorized app
    const grantAccessArgs: GrantAccessParams = {
      protectedData: protectedData.address,
      authorizedApp,
      authorizedUser,
    };

    // We grant the access to the data
    const grantedAccess = await dataProtector.grantAccess(grantAccessArgs);
    console.log('Granted access:', grantedAccess);

    res.status(200).json({
      message: 'Data protected and access granted successfully',
      data: { protectedData: protectedData, AccessGranted: grantedAccess },
    });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

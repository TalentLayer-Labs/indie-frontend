import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';

export const userGaveAccessToPlatform = async (
  userAddress: string,
  providedDataProtector?: IExecDataProtector,
): Promise<boolean> => {
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }

  let dataProtector: IExecDataProtector;
  if (!providedDataProtector) {
    const protectorWebProvider = getProtectorProvider(privateKey);
    dataProtector = new IExecDataProtector(protectorWebProvider);
  } else {
    dataProtector = providedDataProtector;
  }

  const protectedData = await dataProtector.fetchProtectedData({
    owner: userAddress,
    requiredSchema: {
      email: 'string',
    },
  });

  const protectedEmail = protectedData.find(item => item.name === 'TalentLayer email');

  if (!protectedEmail) {
    console.warn(`Web3MailProvider ----  - User ${userAddress} has no protected email`);
    return false;
  }

  const listGrantedAccess = await dataProtector.fetchGrantedAccess({
    protectedData: protectedEmail.address,
    authorizedApp: process.env.NEXT_PUBLIC_WEB3MAIL_APP_ADDRESS,
  });

  if (listGrantedAccess.length == 0) {
    console.warn(`Web3MailProvider ----  - User ${userAddress} has not granted access yet`);
    return false;
  }

  console.warn(`Web3MailProvider ----  - User ${userAddress} has granted access`);

  return true;
};

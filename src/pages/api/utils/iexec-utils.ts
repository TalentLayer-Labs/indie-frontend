import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';

export const userGaveAccessToPlatform = async (userAddress: string): Promise<boolean> => {
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }
  const protectorWebProvider = getProtectorProvider(privateKey);
  const dataProtector = new IExecDataProtector(protectorWebProvider);
  const protectedData = await dataProtector.fetchProtectedData({
    owner: userAddress,
    requiredSchema: {
      email: 'string',
    },
  });

  const protectedEmail = protectedData.find(item => item.name === 'TalentLayer email');

  if (!protectedEmail) {
    console.warn('Web3MailProvider ----  - User has no protected email');
    return false;
  }

  const listGrantedAccess = await dataProtector.fetchGrantedAccess({
    protectedData: protectedEmail.address,
    authorizedApp: process.env.NEXT_PUBLIC_WEB3MAIL_APP_ADDRESS,
  });

  if (listGrantedAccess.length == 0) {
    console.warn('Web3MailProvider ----  - User has not granted access yet');
    return false;
  }

  return true;
};

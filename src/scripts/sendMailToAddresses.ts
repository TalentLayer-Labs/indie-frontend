import { IExecWeb3mail, getWeb3Provider as getMailProvider } from '@iexec/web3mail';
import {
  IExecDataProtector,
  ProtectedData,
  getWeb3Provider as getProtectorProvider,
} from '@iexec/dataprotector';
import { userGaveAccessToPlatform } from '../modules/Web3Mail/utils/iexec-utils';

export const sendMailToAddresses = async (
  emailSubject: string,
  emailContent: string,
  addresses: [string],
  throwable = false,
) => {
  console.log('Sending email to addresses');
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }
  try {
    const mailWeb3Provider = getMailProvider(privateKey);
    const web3mail = new IExecWeb3mail(mailWeb3Provider);
    const protectorWebProvider = getProtectorProvider(privateKey);
    const dataProtector = new IExecDataProtector(protectorWebProvider);

    for (const address of addresses) {
      try {
        console.log(`------- Sending to ${address} -------`);

        // Check whether user granted access to his email
        if (!(await userGaveAccessToPlatform(address, dataProtector))) {
          throwable
            ? throwError(`sendMailToAddresses - User ${address} did not grant access to his email`)
            : console.warn(
                `sendMailToAddresses - User ${address} did not grant access to his email`,
              );
          continue;
        }

        const protectedData: ProtectedData[] = await dataProtector.fetchProtectedData({
          owner: address,
        });
        console.log('protectedData', protectedData);
        const mailSent = await web3mail.sendEmail({
          protectedData: protectedData[0].address,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });

        console.log('sent email', mailSent);
      } catch (e) {
        throwable ? throwError(e) : console.log(e);
      }
    }
  } catch (e) {
    throwable ? throwError(e) : console.log(e);
  }
};

const throwError = (message: any) => {
  throw new Error(message);
};

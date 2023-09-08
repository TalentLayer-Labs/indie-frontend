import { IExecWeb3mail, getWeb3Provider as getMailProvider } from '@iexec/web3mail';
import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';
import { NextApiRequest, NextApiResponse } from 'next';
import { userGaveAccessToPlatform } from '../../../modules/Web3Mail/utils/iexec-utils';

//TODO test API
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emailSubject, emailContent, addresses, throwable = false } = req.body;
  if (!emailSubject || emailContent || addresses) return res.status(500).json(`Missing argument`);

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
        const protectedEmailAddress = await userGaveAccessToPlatform(address, dataProtector);

        if (!protectedEmailAddress) {
          if (throwable) {
            return res
              .status(500)
              .json(`sendMailToAddresses - User ${address} did not grant access to his email`);
          } else {
            console.error(
              `sendMailToAddresses - User ${address} did not grant access to his email`,
            );
          }
          continue;
        }

        //TODO Not tested with new address
        const mailSent = await web3mail.sendEmail({
          protectedData: protectedEmailAddress,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });

        console.log('sent email', mailSent);
      } catch (e: any) {
        if (throwable) {
          return res.status(500).json(e.message);
        } else {
          console.error(e.message);
        }
      }
    }
  } catch (e: any) {
    return res.status(500).json(e.message);
  }
}

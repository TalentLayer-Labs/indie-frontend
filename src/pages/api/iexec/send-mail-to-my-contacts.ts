import { IExecWeb3mail, getWeb3Provider as getMailProvider, Contact } from '@iexec/web3mail';
import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';
import { userGaveAccessToPlatform } from '../../../modules/Web3Mail/utils/iexec-utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { emailSubject, emailContent, throwable = false } = req.body;
  let successCount = 0,
    errorCount = 0;
  if (!emailSubject || !emailContent) return res.status(500).json(`Missing argument`);

  console.log('Sending email to all contacts');
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }
  try {
    const mailWeb3Provider = getMailProvider(privateKey);
    const web3mail = new IExecWeb3mail(mailWeb3Provider);
    const protectorWebProvider = getProtectorProvider(privateKey);
    const dataProtector = new IExecDataProtector(protectorWebProvider);

    console.log('------- All Contacts -------');
    const contactList: Contact[] = await web3mail.fetchMyContacts();
    for (const contact of contactList) {
      try {
        // Check whether user granted access to his email
        if (!(await userGaveAccessToPlatform(contact.address, dataProtector))) {
          if (throwable) {
            return res
              .status(500)
              .json(
                `sendMailToAddresses - User ${contact.address} did not grant access to his email`,
              );
          } else {
            errorCount++;
            console.error(
              `sendMailToMyContacts - User ${contact.address} did not grant access to his email`,
            );
          }
          continue;
        }

        const sentMail = await web3mail.sendEmail({
          protectedData: contact.address,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });
        successCount++;
        console.log('sentMail', sentMail);
      } catch (e: any) {
        if (throwable) {
          return res.status(500).json(e.message);
        } else {
          errorCount++;
          console.error(e.message);
        }
      }
    }
  } catch (e: any) {
    console.error(e.message);
    res.status(500).json(`Error while sending email - ${e.message}`);
  }
  res
    .status(200)
    .json(`Web3 Emails sent - ${successCount} email successfully sent | ${errorCount} errors`);
}

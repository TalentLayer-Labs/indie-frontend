import { IExecWeb3mail, getWeb3Provider as getMailProvider, Contact } from '@iexec/web3mail';
import { userGaveAccessToPlatform } from '../../modules/Web3Mail/utils/iexec-utils';
import { IExecDataProtector, getWeb3Provider as getProtectorProvider } from '@iexec/dataprotector';

export const sendMailToMyContacts = async (
  emailSubject: string,
  emailContent: string,
  throwable = false,
) => {
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
          throwable
            ? throwError(
                `sendMailToMyContacts - User ${contact.address} did not grant access to his email`,
              )
            : console.warn(
                `sendMailToMyContacts - User ${contact.address} did not grant access to his email`,
              );
          continue;
        }

        const sentMail = await web3mail.sendEmail({
          protectedData: contact.address,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });
        console.log('sentMail', sentMail);
      } catch (e) {
        throwable ? throwError(e) : console.error(e);
      }
    }
  } catch (e) {
    throwable ? throwError(e) : console.error(e);
    throw e;
  }
};

const throwError = (message: any) => {
  throw new Error(message);
};

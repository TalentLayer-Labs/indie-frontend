import { IExecWeb3mail, getWeb3Provider as getMailProvider, Contact } from '@iexec/web3mail';
import {
  IExecDataProtector,
  ProtectedData,
  getWeb3Provider as getProtectorProvider,
} from '@iexec/dataprotector';

//TODO: Add filters ?
export const sendMailToMyContacts = async (
  emailSubject: string,
  emailContent: string,
  addresses?: [string],
) => {
  console.log('sendMailToMyContacts');
  const privateKey = process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Private key is not set');
  }
  try {
    const mailWeb3Provider = getMailProvider(privateKey);
    const web3mail = new IExecWeb3mail(mailWeb3Provider);

    if (addresses) {
      // const mocks = [
      //   '0x89de0dd433bd1f6a4ec5dd2593f44b9dd4fad2f0',
      //   '0xb57c073f2862619b4d1abf634476978c3810444c',
      //   '0x99e0655f7bca444638c5a9b122d7d75e65dfd153',
      //   '0xfc5013e22193957ad0eff829d62ebdec7d5a9a63',
      // ];
      for (const address of addresses) {
        // for (const mock of mocks) {
        console.log('------- Selected Addresses -------');
        const protectorWebProvider = getProtectorProvider(privateKey);
        const dataProtector = new IExecDataProtector(protectorWebProvider);
        const protectedData: ProtectedData[] = await dataProtector.fetchProtectedData({
          owner: address,
        });
        console.log('protectedData', protectedData);
        const mailSent = await web3mail.sendEmail({
          protectedData: protectedData[0].address,
          // protectedData: mock,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });

        console.log('sent email', mailSent);
      }
    } else {
      console.log('------- All Contacts -------');
      const contactList: Contact[] = await web3mail.fetchMyContacts();
      console.log('contactList', contactList);
      for (const contact of contactList) {
        const sentMail = await web3mail.sendEmail({
          protectedData: contact.address,
          emailSubject: emailSubject,
          emailContent: emailContent,
        });
        console.log('sentMail', sentMail);
      }
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

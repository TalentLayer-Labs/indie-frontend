import { IExecWeb3mail, getWeb3Provider, Contact } from '@iexec/web3mail';
import { FetchProtectedDataParams, IExecDataProtector } from '@iexec/dataprotector';
import { providers } from 'ethers';

//TODO: Add filters ?
export const sendMailToMyContacts = async (
  emailSubject: string,
  emailContent: string,
  addresses?: [string],
) => {
  const { NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY } = process.env;
  if (!NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY) {
    throw new Error('Private key is not set');
  }
  const web3Provider = getWeb3Provider(NEXT_PUBLIC_WEB3MAIL_PLATFORM_PRIVATE_KEY);
  // const web3Provider2 = (await account.connector?.getProvider()) as providers.ExternalProvider;
  // const dataProtector = new IExecDataProtector(web3Provider);
  const web3mail = new IExecWeb3mail(web3Provider);
  const contactList: Contact[] = await web3mail.fetchMyContacts();
  console.log('contactList', contactList);

  if (addresses) {
    // TODO: For not use dataset address " Unsupported ethProvider"
    // TODO: Faire un fetch par owner sur les protected data.
    // const fetchProtectedDataArg: FetchProtectedDataParams = { owner: addresses[0] };
    // const protectedData = await dataProtector.fetchProtectedData(fetchProtectedDataArg);
    // console.log('protectedData', protectedData);
    // for (const address of addresses) {
    //   console.log('sing send');
    //   const sent = await web3mail.sendEmail({
    //     protectedData: addresses[0],
    //     // protectedData: protectedData[0],
    //     emailSubject: emailSubject,
    //     emailContent: emailContent,
    //   });
    //
    //   console.log('sent email', sent);
    // }
  } else {
    for (const contact of contactList) {
      const sentMail = await web3mail.sendEmail({
        protectedData: contact.address,
        emailSubject: emailSubject,
        emailContent: emailContent,
      });
      // const sentMail = await sendMail(web3mail, contact.address, emailSubject, emailContent);
      console.log('sentMail', sentMail);
    }
  }
};

// const sendMail = async (
//   web3mail: IExecWeb3mail,
//   address: string,
//   subject: string,
//   content: string,
// ) =>
//   web3mail.sendEmail({
//     protectedData: address,
//     emailSubject: subject,
//     emailContent: content,
//   });

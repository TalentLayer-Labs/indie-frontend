import { NextApiRequest, NextApiResponse } from 'next';
import { getIexecPrivateKey } from '../utils/iexec-private';
import { IExecWeb3mail, SendEmailParams, getWeb3Provider } from '@iexec/web3mail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const privateKey = await getIexecPrivateKey(res);

    if (!privateKey) {
      throw new Error('Private key is not set');
    }
    const web3Provider = getWeb3Provider(privateKey);
    const web3mail = new IExecWeb3mail(web3Provider);

    const { emailSubject, emailContent, protectedData }: SendEmailParams = req.body;
    console.log('emailSubject', emailSubject);
    console.log('emailContent', emailContent);
    console.log('protectedData', protectedData);

    const web3MailSent = await web3mail.sendEmail({
      emailSubject: emailSubject,
      emailContent: emailContent,
      protectedData: protectedData,
    });

    console.log('web3mail', web3MailSent);

    res.status(200).json({ message: 'Email sent successfully', data: web3MailSent });
  } catch (error) {
    console.log('errorDebug', error);
    res.status(500).json({ error: error });
  }
}

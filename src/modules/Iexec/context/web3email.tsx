import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGrantedAccess, fetchProtectedData } from '../components/request';
import { FetchGrantedAccessParams, FetchProtectedDataParams } from '@iexec/dataprotector';
import TalentLayerContext from '../../../context/talentLayer';

const Web3MailModalContext = createContext<{
  isRedirect: boolean;

  protectedMails: string;
}>({
  isRedirect: false,

  protectedMails: '',
});

const Web3MailModalProvider = ({ children }: { children: ReactNode }) => {
  const [isRedirect, setIsRedirect] = useState(false);
  const { user } = useContext(TalentLayerContext);
  const [protectedMails, setProtectedMails] = useState('');
  const [isEmailProtected, setIsEmailProtected] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  async function checkIfEmailIsProtected() {
    const fetchProtectedDataArg: FetchProtectedDataParams = {
      owner: user?.address,
    };

    if (user?.address) {
      const tx = await fetchProtectedData(fetchProtectedDataArg);
      setProtectedMails(tx.data.data.fetchProtectedData[0].address);
      setIsEmailProtected(tx.data.dataIsProtected);
    }
  }

  async function checkGrantedPlatform() {
    const fetchGrantedAccessArg: FetchGrantedAccessParams = {
      protectedData: protectedMails as string,
      authorizedUser: process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER as string,
    };

    if (protectedMails && process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER) {
      const tx = await fetchGrantedAccess(fetchGrantedAccessArg);
      setIsGranted(tx.data.isGranted);
    }
  }

  useEffect(() => {
    checkIfEmailIsProtected();
    checkGrantedPlatform();

    if (isEmailProtected && isGranted) {
      setIsRedirect(true);
    }
  }, [user, isEmailProtected, isGranted]);

  const value = useMemo(() => {
    return {
      isRedirect,
      protectedMails,
    };
  }, [isRedirect]);

  return (
    <>
      <Web3MailModalContext.Provider value={value}>{children}</Web3MailModalContext.Provider>
    </>
  );
};

export { Web3MailModalProvider };

export default Web3MailModalContext;

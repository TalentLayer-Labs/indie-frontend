import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGrantedAccess, fetchProtectedData } from '../components/request';
import { FetchGrantedAccessParams, FetchProtectedDataParams } from '@iexec/dataprotector';
import TalentLayerContext from '../../../context/talentLayer';
import Web3EmailModal from '../components/Web3EmailModal';

const Web3MailModalContext = createContext<{
  isRedirect: boolean;
  setActiveModal: (setShow: boolean) => void;
}>({
  isRedirect: true,
  setActiveModal: () => {},
});

const Web3MailModalProvider = ({ children }: { children: ReactNode }) => {
  const [activeModal, setActiveModal] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const { user } = useContext(TalentLayerContext);
  const [protectedMails, setProtectedMails] = useState('');

  // we check if the mail is registered and if the platform is granted
  async function checkIfEmailIsProtected() {
    const fetchProtectedDataArg: FetchProtectedDataParams = {
      owner: user?.address,
    };

    if (user?.address) {
      const tx = await fetchProtectedData(fetchProtectedDataArg);
      setProtectedMails(tx.data.data.fetchProtectedData);
    }
  }

  async function checkGrantedPlatform() {
    const fetchGrantedAccessArg: FetchGrantedAccessParams = {
      protectedData: '0xea032e62f55fe97a5ab21dce0cf6eab01584d879',
      authorizedUser: process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER as string,
    };

    if (protectedMails && process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER) {
      const tx = await fetchGrantedAccess(fetchGrantedAccessArg);
    }
  }

  useEffect(() => {
    checkIfEmailIsProtected();
    checkGrantedPlatform();
  }, [user]);

  useEffect(() => {
    if (protectedMails.length > 0) {
      setIsRedirect(true);
    }
  }, [protectedMails]);

  const value = useMemo(() => {
    return {
      isRedirect,
      setActiveModal,
    };
  }, [activeModal, isRedirect]);

  return (
    <>
      <Web3MailModalContext.Provider value={value}>{children}</Web3MailModalContext.Provider>
      <Web3EmailModal protectedMails={protectedMails} activeModal={activeModal} />
    </>
  );
};

export { Web3MailModalProvider };

export default Web3MailModalContext;

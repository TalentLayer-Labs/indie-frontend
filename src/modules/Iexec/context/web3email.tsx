import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGrantedAccess, fetchProtectedData } from '../components/request';
import { FetchGrantedAccessParams, FetchProtectedDataParams } from '@iexec/dataprotector';
import TalentLayerContext from '../../../context/talentLayer';
import Web3EmailModal from '../components/Web3EmailModal';

const Web3MailModalContext = createContext<{
  isRedirect: boolean;
  activeModal: boolean;
}>({
  isRedirect: false,
  activeModal: false,
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
      return fetchProtectedData(fetchProtectedDataArg).then(tx => {
        setProtectedMails(tx.data.data.fetchProtectedData);
      });
    } else {
      return Promise.resolve();
    }
  }

  async function checkGrantedPlatform() {
    const fetchGrantedAccessArg: FetchGrantedAccessParams = {
      protectedData: '0xea032e62f55fe97a5ab21dce0cf6eab01584d879',
      authorizedUser: process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER as string,
    };

    if (protectedMails && process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER) {
      const tx = await fetchGrantedAccess(fetchGrantedAccessArg);
    } else {
      return Promise.resolve();
    }
  }

  useEffect(() => {
    Promise.all([checkIfEmailIsProtected(), checkGrantedPlatform()])
      .then(() => {
        setIsRedirect(true);
      })
      .catch(error => {
        console.error('mail or access hve not been set up:', error);
        setActiveModal(true);
      });
  }, [user]);

  useEffect(() => {
    if (protectedMails.length > 0) {
      setIsRedirect(true);
    }
  }, [protectedMails]);

  const value = useMemo(() => {
    return {
      isRedirect,
      activeModal,
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

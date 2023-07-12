import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchGrantedAccess, fetchProtectedData } from '../components/request';
import { FetchGrantedAccessParams, FetchProtectedDataParams } from '@iexec/dataprotector';
import TalentLayerContext from '../../../context/talentLayer';

const Web3MailModalContext = createContext<{
  platformHasAccess: boolean;

  protectedMails: string;
}>({
  platformHasAccess: false,

  protectedMails: '',
});

const Web3MailModalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(TalentLayerContext);
  const [platformHasAccess, setPlatformHasAccess] = useState(false);
  const [protectedMails, setProtectedMails] = useState('');
  const [isEmailProtected, setIsEmailProtected] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  async function checkIfEmailIsProtected() {
    if (user?.address) {
      try {
        const fetchProtectedDataArg: FetchProtectedDataParams = { owner: user?.address };
        const tx = await fetchProtectedData(fetchProtectedDataArg);
        setProtectedMails(tx.data.data.fetchProtectedData[0].address);
        setIsEmailProtected(tx.data.dataIsProtected);
      } catch (error) {
        console.error('Error fetching protected data:', error);
      }
    }
  }

  async function checkGrantedPlatform() {
    if (protectedMails && process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER) {
      try {
        const fetchGrantedAccessArg: FetchGrantedAccessParams = {
          protectedData: protectedMails as string,
          authorizedUser: process.env.NEXT_PUBLIC_IEXEC_AUTHORIZED_USER as string,
        };
        const tx = await fetchGrantedAccess(fetchGrantedAccessArg);
        setIsGranted(tx.data.isGranted);
        console.log('isGranted', isGranted);

        if (isEmailProtected && isGranted) {
          setPlatformHasAccess(true);
        }
      } catch (error) {
        console.error('Error checking granted platform:', error);
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await checkIfEmailIsProtected();
      await checkGrantedPlatform();
      console.log('platformHasAccess', platformHasAccess);
    };

    fetchData();
  }, [user, protectedMails]);

  const value = useMemo(
    () => ({ platformHasAccess, protectedMails }),
    [platformHasAccess, protectedMails],
  );

  return (
    <>
      <Web3MailModalContext.Provider value={value}>{children}</Web3MailModalContext.Provider>
    </>
  );
};

export { Web3MailModalProvider };
export default Web3MailModalContext;

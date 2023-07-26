import { GrantedAccess, IExecDataProtector, ProtectedData } from '@iexec/dataprotector';
import { IExecWeb3mail } from '@iexec/web3mail';
import { providers } from 'ethers';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import TalentLayerContext from '../../../context/talentLayer';

const Web3MailContext = createContext<{
  platformHasAccess: boolean;
}>({
  platformHasAccess: false,
});

const Web3MailProvider = ({ children }: { children: ReactNode }) => {
  const { account } = useContext(TalentLayerContext);
  const [platformHasAccess, setPlatformHasAccess] = useState(false);
  const [dataProtector, setDataProtector] = useState<IExecDataProtector>();
  const [web3mail, setWeb3mail] = useState<IExecWeb3mail>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [protectedEmail, setProtectedEmail] = useState<ProtectedData | undefined>();
  const [emailGrantedAccess, setEmailGrantedAccess] = useState<GrantedAccess | undefined>();

  console.log('Web3MailProvider ---- call', {
    dataProtector,
    account,
    protectedEmail,
    emailGrantedAccess,
  });

  /*
   * @what: Init The dataProtector and web3mail modules
   * @when: Execute it only once after user is connected, and only if user switch wallet
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!account?.isConnected || dataProtector || web3mail) {
        return;
      }

      console.log('Web3MailProvider ---- Init The dataProtector', { dataProtector, account });

      // Note: RPC error if using provider
      // setDataProtector(new IExecDataProtector(provider as providers.ExternalProvider));
      // setWeb3mail(new IExecWeb3mail(provider as providers.ExternalProvider));

      // TODO: this variable is cast as ExternalProvider but will be replace by Provider
      const provider2 = (await account.connector?.getProvider()) as providers.ExternalProvider;
      setDataProtector(new IExecDataProtector(provider2));
      setWeb3mail(new IExecWeb3mail(provider2));

      // This work but better in our case to use account from the hook
      // const provider2 = await getAccount().connector?.getProvider();
      // setDataProtector(new IExecDataProtector(provider2));
      // setWeb3mail(provider2);
    };
    fetchData();
  }, [account]);

  /*
   * @what: Check if platform has access to the user email
   * @when: Execute it only once after user is connected, and only if user switch wallet
   */
  useEffect(() => {
    console.log('Web3MailProvider ---- fetchdata', { dataProtector, web3mail });
    if (!dataProtector || !web3mail || !account?.isConnected || isFetching) return;

    setIsFetching(true);

    const fetchData = async () => {
      console.log('Web3MailProvider ----  before fetching');
      const protectedData = await dataProtector.fetchProtectedData({
        owner: account.address,
        requiredSchema: {
          email: 'string',
        },
      });

      const protectedEmail = protectedData.find(item => item.name === 'Untitled');

      if (!protectedEmail) {
        console.warn('Web3MailProvider ----  - User has no protected email');
        return;
      }

      console.log('Web3MailProvider ----  - before fetchGrantedAccess', protectedEmail);
      // Stuck here: WorkflowError: Failed to fetch granted access to this data: Failed to create contracts client: Missing iExec contract default address for chain 80001
      const listGrantedAccess = await dataProtector.fetchGrantedAccess({
        protectedData: protectedEmail.address,
        authorizedApp: process.env.NEXT_PUBLIC_WEB3MAIL_APP_ADDRESS,
        authorizedUser: process.env.NEXT_PUBLIC_WEB3MAIL_PLATFORM_PUBLIC_KEY,
      });

      if (listGrantedAccess.length == 0) {
        console.warn('Web3MailProvider ----  - User has not granted access yet');
        return;
      }

      const emailGrantedAccess = listGrantedAccess[0];

      // Todo: try directly fetchMyContacts
      // const contacts = await web3mail.fetchMyContacts();

      console.log('Web3MailProvider ---- ', {
        address: account,
        protectedData,
        protectedEmail,
        emailGrantedAccess,
        listGrantedAccess,
      });

      setProtectedEmail(protectedEmail);
      setEmailGrantedAccess(emailGrantedAccess);
    };
    fetchData().then(() => {
      setIsFetching(false);
    });
  }, [account]);

  const value = useMemo(() => {
    return {
      platformHasAccess,
    };
  }, [platformHasAccess]);

  return <Web3MailContext.Provider value={value}>{children}</Web3MailContext.Provider>;
};

export { Web3MailProvider };

export default Web3MailContext;

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { config } from '../config';
import TalentLayerID from '../contracts/ABI/TalentLayerID.json';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useProvider, useSigner } from 'wagmi';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../utils/toast';
import * as Yup from 'yup';
import Toggle from '../components/Form/Toggle';
import {
  dataProtector,
  fetchProtectedData,
  delegateUpdateProfileData,
} from '../components/request';
import { FetchProtectedDataParams } from '@iexec/dataprotector';
import TalentLayerContext from './talentLayer';
import { useWeb3Modal } from '@web3modal/react';
import { postToIPFS } from '../utils/ipfs';

// Switch import statement will depend on your UI library or your custom component

const Web3MailModalContext = createContext<{
  isRedirect: boolean;
}>({
  isRedirect: true,
});

const Web3MailModalProvider = ({ children }: { children: ReactNode }) => {
  const [show, setShow] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const { open: openConnectModal } = useWeb3Modal();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [proposalConsent, setProposalConsent] = useState(false);
  const { user } = useContext(TalentLayerContext);

  const { isActiveDelegate } = useContext(TalentLayerContext);
  const [protectedMails, setProtectedMails] = useState([]);
  console.log('protectedMails server side', protectedMails);

  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  async function handleAgreeAndClose() {
    if (user && provider && signer) {
      try {
        const cid = await postToIPFS(
          JSON.stringify({
            title: user.description?.title,
            role: user.description?.role,
            image_url: user.description?.image_url,
            video_url: user.description?.video_url,
            name: user.description?.name,
            about: user.description?.about,
            skills: user.description?.skills_raw,
            mail: {
              proposalConsent: proposalConsent,
            },
          }),
        );

        console.log('cid', cid);

        let tx;
        if (isActiveDelegate) {
          const response = await delegateUpdateProfileData(user.id, user.address, cid);
          tx = response.data.transaction;
        } else {
          const contract = new ethers.Contract(
            config.contracts.talentLayerId,
            TalentLayerID.abi,
            signer,
          );
          tx = await contract.updateProfileData(user.id, cid);
        }

        await createMultiStepsTransactionToast(
          {
            pending: 'Updating profile...',
            success: 'Congrats! Your preferences has been updated',
            error: 'An error occurred while updating your preferences',
          },
          provider,
          tx,
          'user',
          cid,
        );
        setShow(false);
        setIsRedirect(true);
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  }

  async function fetchProtectedMail() {
    const fetchProtectedDataArg: FetchProtectedDataParams = {
      owner: user?.address,
    };

    // if user?.address is undefined it will fetch the whole protected data
    if (user?.address) {
      const tx = await fetchProtectedData(fetchProtectedDataArg);
      console.log('fetchProtectedDataTest:', tx.data.data.fetchProtectedData);
      setProtectedMails(tx.data.data.fetchProtectedData);
    }

    if (protectedMails.length > 0) {
      setIsRedirect(true);
    }
  }

  interface IFormValues {
    email: string;
  }

  useEffect(() => {
    fetchProtectedMail();
  }, [user]);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    //***************** Data fetch & protection ************* */
    // TODO : Add a name to the data to protect like the user handle
    const dataProtectorFetch = await dataProtector({ data: { email: values.email } });
    setSubmitting(true);
    resetForm();
  };

  const value = useMemo(() => {
    return {
      isRedirect,
    };
  }, [show, isRedirect]);

  return (
    <>
      <Web3MailModalContext.Provider value={value}>{children}</Web3MailModalContext.Provider>
      {protectedMails.length === 0 && show && (
        <div
          className={`${
            !show ? 'hidden' : ''
          } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full bg-black/75 flex flex-col items-center justify-center`}>
          <div className='relative p-4 w-full max-w-2xl h-auto'>
            <div className='relative bg-white rounded-lg shadow '>
              <div className='flex justify-between items-start p-4 rounded-t border-b '>
                <h3 className='text-xl font-semibold text-gray-900 '>Web3Mail information</h3>
              </div>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({ isSubmitting }) => (
                  <Form className='p-6 space-y-6'>
                    <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                      <div className='flex flex-row'>
                        <h3 className='font-semibold text-gray-900'>
                          Mail protection and grant access
                        </h3>
                      </div>
                      <p>Here we will explain how the mail protector and grant access is working</p>
                      <Field
                        type='email'
                        name='email'
                        placeholder='Enter your email'
                        className='...'
                      />
                      <ErrorMessage name='email' component='div' className='error-message' />
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='block text-white bg-blue-600 font-medium rounded-lg px-5 py-2.5 text-center'>
                        PROTECT MY MAIL
                      </button>
                      <div className='mt-4'>
                        <div className='flex flex-row mb-4'>
                          <h3 className='font-semibold text-gray-900'>Consent Management</h3>
                        </div>
                        <p className='mb-4'>
                          Here we will explain how the mail protector and grant access is working
                        </p>
                        <div className='flex flex-row mb-4'>
                          <button
                            onClick={() => setAccordionOpen(prevState => !prevState)}
                            type='submit'
                            disabled={isSubmitting}
                            className='block text-black bg-white border border-black font-medium rounded-lg px-5 py-2.5 text-center mr-4'>
                            LEARN MORE
                          </button>
                          <button
                            onClick={async () => {
                              await handleAgreeAndClose();
                              setShow(false);
                            }}
                            type='submit'
                            disabled={isSubmitting}
                            className='block text-white bg-blue-600 font-medium rounded-lg px-5 py-2.5 text-center'>
                            AGREE AND CLOSE
                          </button>
                        </div>
                        {accordionOpen && (
                          <div className='mt-4'>
                            <label>
                              <Toggle
                                proposalConsent={proposalConsent}
                                setProposalConsent={setProposalConsent}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Web3MailModalProvider };

export default Web3MailModalContext;

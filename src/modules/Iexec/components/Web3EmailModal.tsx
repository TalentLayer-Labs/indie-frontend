import { useContext, useState } from 'react';
import { ethers, providers } from 'ethers';
import { config } from '../../../config';
import TalentLayerID from '../../../contracts/ABI/TalentLayerID.json';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useProvider, useSigner } from 'wagmi';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../../utils/toast';
import * as Yup from 'yup';
import Toggle from './Toggle';
import Loading from '../../../components/Loading';
import { delegateUpdateProfileData } from '../../../components/request';
import TalentLayerContext from '../../../context/talentLayer';
import { useWeb3Modal } from '@web3modal/react';
import { postToIPFS } from '../../../utils/ipfs';
import { GrantAccessParams, IExecDataProtector } from '@iexec/dataprotector';

interface Web3EmailModalProps {
  protectedMails: string;
  activeModal: boolean;
}

function Web3EmailModal({ protectedMails, activeModal }: Web3EmailModalProps) {
  //TODO : activeModal instead of true, only for test purpose
  const [show, setShow] = useState(false);
  const { open: openConnectModal } = useWeb3Modal();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [consentsMgmt, setConsentsMgmt] = useState([true, true]);
  const { user } = useContext(TalentLayerContext);
  const { isActiveDelegate } = useContext(TalentLayerContext);
  const [mailProtectionMessage, setMailProtectionMessage] = useState('');
  const [isMailError, setIsMailError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authorizedApp = process.env.NEXT_PUBLIC_MAIL_AUTHORIZE_APP_ADDRESS;
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });

  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  interface IFormValues {
    email: string;
  }

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
    setIsLoading(true);
    try {
      //   if (!window.ethereum) {
      //     // Handle error here
      //     console.error('No Ethereum provider found.');
      //     return;
      //   }
      //   const web3Provider = window.ethereum;
      //   const dataProtector = new IExecDataProtector(provider);
      //   if (!web3Provider || !dataProtector) {
      //     // Handle error here
      //     console.error('No Ethereum provider found.');
      //     return;
      //   }
      //   const protectedData = await dataProtector.protectData({ data: { email: values.email } });
      //   console.log('protectedData', protectedData);
      //   if (!protectedData || !authorizedApp || !user?.address) {
      //     // Handle error here
      //     console.error('please check your data');
      //     return;
      //   }
      //   const grantAccessArgs: GrantAccessParams = {
      //     protectedData: protectedData.address,
      //     authorizedApp: authorizedApp as string,
      //     authorizedUser: user?.address as string,
      //   };
      //   //   We grant the access to the data
      //   const grantedAccess = await dataProtector.grantAccess(grantAccessArgs);
      //   console.log('Granted access:', grantedAccess);
      //   if (protectedData && grantedAccess) {
      //     setMailProtectionMessage('Your email has been protected');
      //     setIsMailError(false);
      //   }
    } catch (error) {
      console.error('Error occurred while protecting your email: ', error);
      setMailProtectionMessage('An error occurred while protecting your email');
      setIsMailError(true);
    }
    setIsLoading(false);
    setSubmitting(true);
    resetForm();
  };

  async function handleAgreeAndClose() {
    if (user && provider && signer) {
      if (!consentsMgmt.includes(false)) {
        return;
      }
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
            mail: consentsMgmt,
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
        // setIsRedirect(true);
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  }

  return (
    <>
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
                      {isLoading ? (
                        <Loading size='8' />
                      ) : (
                        <p className={isMailError ? 'text-red-500' : 'text-green-500'}>
                          {mailProtectionMessage}
                        </p>
                      )}
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
                                consentsMgmt={consentsMgmt}
                                setConsentsMgmt={setConsentsMgmt}
                                labels={[
                                  'Receive notification when someone send a proposal',
                                  'Another consent',
                                  'Third consent',
                                ]}
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
}

export default Web3EmailModal;

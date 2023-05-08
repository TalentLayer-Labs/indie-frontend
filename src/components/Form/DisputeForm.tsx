import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import ServiceRegistry from '../../contracts/ABI/TalentLayerService.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import SubmitButton from './SubmitButton';
import FileDropper from '../../modules/Kleros/components/FileDropper';
import { generateEvidence } from '../../modules/Kleros/utils/generateMetaEvidence';

interface IFormValues {
  title: string;
  about: string;
}

const initialValues: IFormValues = {
  title: '',
  about: '',
};

function DisputeForm({ transactionId }: { transactionId: string }) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user, account } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const [fileSelected, setFileSelected] = useState<File>();

  const router = useRouter();

  const validationSchema = Yup.object({
    title: Yup.string().required('Please provide a title for your evidence'),
    about: Yup.string().required('Please provide a description of your evidence'),
  });

  useEffect(() => {
    if (fileSelected) {
      console.log(fileSelected);
    }
  }, [fileSelected]);

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (account?.isConnected === true && provider && signer) {
      try {
        const evidenceCid = 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v';
        const metaEvidence = generateEvidence(evidenceCid, values.title, values.about);
        const metaEvidenceCid = await postToIPFS(JSON.stringify(metaEvidence));

        const contract = new ethers.Contract(
          config.contracts.talentLayerEscrow,
          ServiceRegistry.abi,
          signer,
        );
        const tx = await contract.submitEvidence(user?.id, transactionId, metaEvidenceCid);
        const newId = await createMultiStepsTransactionToast(
          {
            pending: 'Submitting evidence...',
            success: 'Congrats! Your evidence has been submitted',
            error: 'An error occurred while submitting your evidence ',
          },
          provider,
          tx,
          'evidence',
          metaEvidenceCid,
        );
        setSubmitting(false);
        resetForm();
        if (newId) {
          router.reload();
        }
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6'>
            <label className='block'>
              <span className='text-gray-700'>Title</span>
              <Field
                type='text'
                id='title'
                name='title'
                className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='title' />
              </span>
            </label>

            <label className='block'>
              <span className='text-gray-700'>About</span>
              <Field
                as='textarea'
                id='about'
                name='about'
                className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='about' />
              </span>
            </label>

            <label className='block'>
              <span className='text-gray-700'>Drop Files Here</span>
              <FileDropper setFileSelected={setFileSelected} />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Post' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default DisputeForm;

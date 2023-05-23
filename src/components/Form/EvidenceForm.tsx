import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import * as Yup from 'yup';
import SubmitButton from './SubmitButton';
import FileDropper from '../../modules/Kleros/components/FileDropper';
import { postToIPFS } from '../../utils/ipfs';
import { ethers } from 'ethers';
import { config } from '../../config';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import { generateEvidence } from '../../modules/Kleros/utils/generateMetaEvidence';
import TalentLayerEscrow from '../../contracts/ABI/TalentLayerEscrow.json';
import TalentLayerContext from '../../context/talentLayer';
import { useWeb3Modal } from '@web3modal/react';
import { useProvider, useSigner } from 'wagmi';
import ServiceItem from '../ServiceItem';

interface IFormValues {
  title: string;
  about: string;
  file: File | null;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Please provide a title for your evidence'),
  about: Yup.string().required('Please provide a description of your evidence'),
  file: Yup.mixed().required('Please provide a file'),
});

const initialValues: IFormValues = {
  title: '',
  about: '',
  file: null,
};

function EvidenceForm({ transactionId }: { transactionId: string }) {
  const { account, user } = useContext(TalentLayerContext);
  const { open: openConnectModal } = useWeb3Modal();
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const [fileSelected, setFileSelected] = useState<File>();

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (account?.isConnected === true && provider && signer) {
      try {
        const fileExtension = values.file?.name.split('.').pop();
        console.log('fileExtension', fileExtension);
        console.log('values.file', values.file);
        // const fileCid = 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v';
        if (!values.file) return;
        const arr = await values?.file.arrayBuffer();
        console.log('arr', arr);
        const fileCid = await postToIPFS(arr);
        console.log('fileCid', fileCid);

        const evidence = generateEvidence(
          values.title,
          values.about,
          fileCid,
          fileExtension as string,
        );
        console.log('evidence', evidence);
        // const evidenceCid = 'QmQ2hcACF6r2Gf8PDxG4NcBdurzRUopwcaYQHNhSah6a8v';
        const evidenceCid = await postToIPFS(JSON.stringify(evidence));
        console.log('evidenceCid', evidenceCid);

        const contract = new ethers.Contract(
          config.contracts.talentLayerEscrow,
          TalentLayerEscrow.abi,
          signer,
        );
        const tx = await contract.submitEvidence(user?.id, transactionId, evidenceCid);
        await createMultiStepsTransactionToast(
          {
            pending: 'Submitting evidence...',
            success: 'Congrats! Your evidence has been submitted',
            error: 'An error occurred while submitting your evidence ',
          },
          provider,
          tx,
          'evidence',
          evidenceCid,
        );
        setSubmitting(false);
        resetForm();
        setFileSelected(undefined);
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting, dirty, isValid }) => (
        <>
          <Form>
            <h2 className=' mt-8 mb-2 text-gray-900 font-bold'>Add evidence:</h2>
            <div className='grid grid-rows-2 grid-cols-3 gap-6 border border-gray-200 rounded-md p-8'>
              <label className='block row-span-1 col-span-2'>
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

              <label className='block row-span-2 col-span-1'>
                <FileDropper setFileSelected={setFileSelected} fileSelected={fileSelected} />

                <Field type='hidden' id='file' name='file' />
                <span className='text-red-500'>
                  <ErrorMessage name='file' />
                </span>
              </label>

              <label className='block row-span-2 col-span-2'>
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
            </div>
            <div className='flex flex-row justify-between items-center mt-4'>
              <SubmitButton
                isSubmitting={isSubmitting}
                disabled={!isValid || !dirty}
                label='Submit evidence'
              />
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default EvidenceForm;

import { useWeb3Modal } from '@web3modal/react';
import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import Loading from '../Loading';
import SubmitButton from './SubmitButton';
import useUserById from '../../hooks/useUserById';
import { SkillsInput } from './skills-input';
import { delegateUpdateProfileData } from '../request';

interface IFormValues {
  title?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
  company: Yup.string().required('company is required'),
  startDate: Yup.string().required('start date is required'),
});

function WorkExperienceForm({ callback }: { callback?: () => void }) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const userDescription = user?.id ? useUserById(user?.id)?.description : null;
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const { isActiveDelegate } = useContext(TalentLayerContext);

  if (!user?.id) {
    return <Loading />;
  }

  const initialValues: IFormValues = {
    title: userDescription?.title || '',
    company: userDescription?.role || '',
    startDate: userDescription?.image_url || '',
    endDate: userDescription?.video_url || '',
    description: userDescription?.name || '',
  };

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (user && provider && signer) {
      try {
        const schemaRegistryContractAddress = "0x340a861431d6f541b12b060f543BA64EBc559354";
        const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

        schemaRegistry.connect(signer);

        const schema = "uint16 voteIndex";
        const resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
        const revocable = true;

        const transaction = await schemaRegistry.register({
          schema,
          resolverAddress,
          revocable,
        });

        // Optional: Wait for transaction to be validated
        await transaction.wait();

        if (callback) {
          callback();
        }

        setSubmitting(false);
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>Title</span>
              <Field
                type='text'
                id='title'
                name='title'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>
            <label className='block'>
              <span className='text-gray-700'>Company</span>
              <Field
                type='text'
                id='company'
                name='company'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>
            <label className='block'>
              <span className='text-gray-700'>Start Date</span>
              <Field
                type='date'
                id='startDate'
                name='startDate'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''>
              </Field>
            </label>
            <label className='block'>
              <span className='text-gray-700'>End Date</span>
              <Field
                type='date'
                id='endDate'
                name='endDate'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''>
              </Field>
            </label>

            <label className='block'>
              <span className='text-gray-700'>Description</span>
              <Field
                as='textarea'
                id='description'
                name='description'
                rows='4'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Add' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default WorkExperienceForm;

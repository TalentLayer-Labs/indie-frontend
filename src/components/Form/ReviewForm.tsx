import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerReview from '../../contracts/ABI/TalentLayerReview.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import SubmitButton from './SubmitButton';
import { getUserByAddress } from '../../queries/users';
import { delegateMintReview } from '../request';

interface IFormValues {
  content: string;
  rating: number;
}

const validationSchema = Yup.object({
  content: Yup.string().required('Please provide a content'),
  rating: Yup.string().required('rating is required'),
});

const initialValues: IFormValues = {
  content: '',
  rating: 3,
};

function ReviewForm({ serviceId }: { serviceId: string }) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (user && provider && signer) {
      try {
        const uri = await postToIPFS(
          JSON.stringify({
            content: values.content,
            rating: values.rating,
          }),
        );

        const getUser = await getUserByAddress(user.address);
        const delegateAddresses = getUser.data?.data?.users[0].delegates;
        let tx;

        if (
          process.env.NEXT_PUBLIC_ACTIVE_DELEGATE &&
          delegateAddresses &&
          delegateAddresses.indexOf(config.delegation.address.toLowerCase()) != -1
        ) {
          const response = await delegateMintReview(
            user.id,
            user.address,
            serviceId,
            uri,
            values.rating,
          );
          tx = response.data.transaction;
        } else {
          const contract = new ethers.Contract(
            config.contracts.talentLayerReview,
            TalentLayerReview.abi,
            signer,
          );
          tx = await contract.mint(user.id, serviceId, uri, values.rating);
        }

        await createMultiStepsTransactionToast(
          {
            pending: 'Creating your review...',
            success: 'Congrats! Your review has been posted',
            error: 'An error occurred while creating your review',
          },
          provider,
          tx,
          'review',
          uri,
        );
        setSubmitting(false);
        resetForm();
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
      {({ isSubmitting, errors }) => (
        <Form>
          {/* {Object.keys(errors).map(errorKey => (
            <div key={errorKey}>{errors[errorKey]}</div>
          ))} */}
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>Message</span>
              <Field
                as='textarea'
                id='content'
                name='content'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
                rows={5}
              />
              <span className='text-red-500'>
                <ErrorMessage name='content' />
              </span>
            </label>

            <label className='block'>
              <span className='text-gray-700'>Rating</span>
              <Field
                type='number'
                id='rating'
                name='rating'
                min={0}
                max={5}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              />
              <span className='text-red-500'>
                <ErrorMessage name='rating' />
              </span>
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Post your review' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ReviewForm;

import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerReview from '../../contracts/ABI/TalentLayerReview.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast } from '../../utils/toast';
import SubmitButton from './SubmitButton';

interface IFormValues {
  content: string;
  rating: number;
}

const validationSchema = Yup.object({
  content: Yup.string().required('content is required'),
  rating: Yup.string().required('rating is required'),
});

const initialValues: IFormValues = {
  content: '',
  rating: 3,
};

function ReviewForm({ serviceId }: { serviceId: string }) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });

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

        const contract = new ethers.Contract(
          config.contracts.talentLayerReview,
          TalentLayerReview.abi,
          signer,
        );
        const tx = await contract.addReview(
          user.id,
          serviceId,
          uri,
          values.rating,
          import.meta.env.VITE_PLATFORM_ID,
        );
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
        console.error(error);
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
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Post your review' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ReviewForm;

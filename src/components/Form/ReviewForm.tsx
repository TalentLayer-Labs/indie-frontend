import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { useConnectModal, useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerReview from '../../contracts/ABI/TalentLayerReview.json';
import useUserDetails from '../../hooks/useUserDetails';
import postToIPFS from '../../utils/ipfs';
import Loading from '../Loading';
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
  const { open: openConnectModal } = useConnectModal();
  const { user } = useContext(TalentLayerContext);
  const { provider } = useProvider();
  const { data: signer, refetch: refetchSigner } = useSigner();

  useEffect(() => {
    (async () => {
      await refetchSigner({ chainId: 5 });
    })();
  }, []);

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (user !== undefined && provider !== undefined && signer !== undefined) {
      try {
        const uri = await postToIPFS(
          JSON.stringify({
            content: values.content,
            rating: values.rating,
          }),
        );

        const contract = new ethers.Contract(
          '0x67EE2a1f75788794f516b8F9919496D63109A380',
          TalentLayerReview.abi,
          signer,
        );
        const tx = await contract.addReview(serviceId, uri, values.rating, '1');
        const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
          pending: 'Your transaction is pending',
          success: 'Congrats! Your review has been posted',
          error: 'An error occurred while creating your review',
        });
        setSubmitting(false);

        if (receipt.status === 1) {
          resetForm();
        } else {
          console.log('error');
        }
      } catch (error) {
        const parsedEthersError = getParsedEthersError(error as EthersError);
        toast.error(`${parsedEthersError.errorCode} - ${parsedEthersError.context}`);
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

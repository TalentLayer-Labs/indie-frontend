import { useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { config } from '../../config';
import ServiceRegistry from '../../contracts/ABI/ServiceRegistry.json';
import { IService } from '../../types';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast } from '../../utils/toast';
import { parseRateAmount } from '../../utils/web3';
import ServiceItem from '../ServiceItem';
import SubmitButton from './SubmitButton';

interface IFormValues {
  description: string;
  rateToken: string;
  rateAmount: number;
}

const initialValues: IFormValues = {
  description: '',
  rateToken: '',
  rateAmount: 0,
};

const validationSchema = Yup.object({
  description: Yup.string().required('description is required'),
  rateToken: Yup.string().required('rate is required'),
  rateAmount: Yup.string().required('amount is required'),
});

function ProposalForm({ service }: { service: IService }) {
  const { provider } = useProvider();
  const { data: signer, refetch: refetchSigner } = useSigner();
  const navigate = useNavigate();

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
    if (provider !== undefined && signer !== undefined) {
      try {
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
        );
        const parsedRateAmountString = parsedRateAmount.toString();
        const uri = await postToIPFS(
          JSON.stringify({
            description: values.description,
          }),
        );

        const contract = new ethers.Contract(
          config.contracts.serviceRegistry,
          ServiceRegistry.abi,
          signer,
        );

        const tx = await contract.createProposal(
          service.id,
          values.rateToken,
          parsedRateAmountString,
          uri,
        );
        await createMultiStepsTransactionToast(
          {
            pending: 'Creating your proposal...',
            success: 'Congrats! Your proposal has been added',
            error: 'An error occurred while creating your proposal',
          },
          provider,
          tx,
          'proposals',
          uri,
        );
        setSubmitting(false);
        resetForm();
        navigate(-1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <h2 className='mb-2 text-gray-900 font-bold'>For the job:</h2>
          <ServiceItem service={service} />

          <h2 className=' mt-8 mb-2 text-gray-900 font-bold'>Detailed your proposal:</h2>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>Description</span>
              <Field
                as='textarea'
                id='description'
                rows={8}
                name='description'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <div className='flex'>
              <label className='block flex-1 mr-4'>
                <span className='text-gray-700'>Amount</span>
                <Field
                  type='number'
                  id='rateAmount'
                  name='rateAmount'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''
                />
              </label>

              <label className='block'>
                <span className='text-gray-700'>Token</span>
                <Field
                  component='select'
                  id='rateToken'
                  name='rateToken'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''>
                  <option value=''>Select a token</option>
                  {Object.keys(config.tokens).map((address, index) => (
                    <option key={index} value={address}>
                      {config.tokens[address].symbol}
                    </option>
                  ))}
                </Field>
              </label>
            </div>

            <SubmitButton isSubmitting={isSubmitting} label='Post' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProposalForm;

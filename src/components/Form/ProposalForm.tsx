import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import ServiceRegistry from '../../contracts/ABI/TalentLayerService.json';
import { IService, IUser } from '../../types';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import { parseRateAmount } from '../../utils/web3';
import ServiceItem from '../ServiceItem';
import SubmitButton from './SubmitButton';
import useAllowedTokens from '../../hooks/useAllowedTokens';

interface IFormValues {
  about: string;
  rateToken: string;
  rateAmount: number;
  expirationDate: number;
}

const initialValues: IFormValues = {
  about: '',
  rateToken: '',
  rateAmount: 0,
  expirationDate: 15,
};

const validationSchema = Yup.object({
  about: Yup.string().required('about is required'),
  rateToken: Yup.string().required('rate is required'),
  rateAmount: Yup.string().required('amount is required'),
  expirationDate: Yup.number().integer().required('expiration date is required'),
});

function ProposalForm({ user, service }: { user: IUser; service: IService }) {
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const navigate = useNavigate();
  const allowedTokenList = useAllowedTokens();

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    const token = allowedTokenList.find(token => token.address === values.rateToken);
    if (provider && signer && token) {
      try {
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
          token.decimals,
        );
        const now = Math.floor(Date.now() / 1000);
        const convertExpirationDate = now + 60 * 60 * 24 * values.expirationDate;
        const convertExpirationDateString = convertExpirationDate.toString();

        const parsedRateAmountString = parsedRateAmount.toString();
        const uri = await postToIPFS(
          JSON.stringify({
            about: values.about,
          }),
        );

        const contract = new ethers.Contract(
          config.contracts.serviceRegistry,
          ServiceRegistry.abi,
          signer,
        );

        const tx = await contract.createProposal(
          user.id,
          service.id,
          values.rateToken,
          parsedRateAmountString,
          import.meta.env.VITE_PLATFORM_ID,
          uri,
          convertExpirationDateString,
        );
        await createMultiStepsTransactionToast(
          {
            pending: 'Creating your proposal...',
            success: 'Congrats! Your proposal has been added',
            error: 'An error occurred while creating your proposal',
          },
          provider,
          tx,
          'proposal',
          uri,
        );
        setSubmitting(false);
        resetForm();
        navigate(-1);
      } catch (error) {
        showErrorTransactionToast(error);
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
              <span className='text-gray-700'>about</span>
              <Field
                as='textarea'
                id='about'
                rows={8}
                name='about'
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
                  {allowedTokenList.map((token, index) => (
                    <option key={index} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </Field>
              </label>
            </div>
            <label className='block flex-1'>
              <span className='text-gray-700'>Expiration Date (Days)</span>
              <Field
                type='number'
                id='expirationDate'
                name='expirationDate'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Post' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProposalForm;

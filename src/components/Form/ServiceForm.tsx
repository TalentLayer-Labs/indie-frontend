import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { useConnectModal, useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import ServiceRegistry from '../../contracts/ABI/ServiceRegistry.json';
import postToIPFS from '../../utils/ipfs';
import { parseRateAmount } from '../../utils/web3';
import TransactionToast from '../TransactionToast';
import SubmitButton from './SubmitButton';

interface IFormValues {
  title: string;
  about: string;
  keywords: string;
  rateToken: string;
  rateAmount: number;
}

const initialValues: IFormValues = {
  title: '',
  about: '',
  keywords: '',
  rateToken: '',
  rateAmount: 0,
};

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
  about: Yup.string().required('about is required'),
  keywords: Yup.string().required('keywords are required'),
  rateToken: Yup.string().required('rate is required'),
  rateAmount: Yup.string().required('amount is required'),
});

function ServiceForm() {
  const { open: openConnectModal } = useConnectModal();
  const { account } = useContext(TalentLayerContext);
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
    if (account?.isConnected === true && provider !== undefined && signer !== undefined) {
      try {
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
        );
        const parsedRateAmountString = parsedRateAmount.toString();
        const uri = await postToIPFS(
          JSON.stringify({
            title: values.title,
            about: values.about,
            keywords: values.keywords,
            role: 'buyer',
            rateToken: values.rateToken,
            rateAmount: parsedRateAmountString,
          }),
        );

        const contract = new ethers.Contract(
          config.contracts.serviceRegistry,
          ServiceRegistry.abi,
          signer,
        );
        const tx = await contract.createOpenServiceFromBuyer('1', uri);
        const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
          pending: {
            render() {
              return (
                <TransactionToast
                  message='Your job creation is in progress'
                  transactionHash={tx.hash}
                />
              );
            },
          },
          success:
            'Congrats! Your new job has been added, it will be visible in a few minutes in the dedicated section.',
          error: 'An error occurred while creating your job',
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
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
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
              <span className='text-gray-700'>About</span>
              <Field
                as='textarea'
                id='about'
                name='about'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <label className='block'>
              <span className='text-gray-700'>Keywords</span>
              <Field
                type='text'
                id='keywords'
                name='keywords'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder='keyword1, keyword2...'
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

export default ServiceForm;

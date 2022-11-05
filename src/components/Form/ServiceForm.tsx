import { useAccount, useConnectModal, useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { CONST } from '../../constants';
import ServiceRegistry from '../../contracts/ServiceRegistry.json';
import useUser from '../../hooks/useUser';
import postToIPFS from '../../services/ipfs';
import { parseRateAmount } from '../../services/web3';
import SubmitButton from './SubmitButton';

interface IFormValues {
  title: string;
  about: string;
  keywords: string;
  rateToken: string;
  rateAmount: string;
}

const tokens = [
  {
    name: CONST.DAI_SYMBOL,
    address: CONST.DAI_ADDRESS,
  },
  {
    name: CONST.USDC_SYMBOL,
    address: CONST.USDC_ADDRESS,
  },
  {
    name: CONST.ETH_SYMBOL,
    address: CONST.ETH_ADDRESS,
  },
];

function ServiceForm() {
  const { account } = useAccount();
  const user = useUser();
  const { open: openConnectModal } = useConnectModal();
  const { data: signer } = useSigner();
  const { provider } = useProvider();
  const [hasSucceed, setHasSucceed] = useState(false);

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    console.log('onSubmit', values);
    if (account.isConnected === true && provider && signer) {
      try {
        console.log(provider);
        const parsedRateAmount = await parseRateAmount(values.rateAmount, values.rateToken, signer);
        const uri = await postToIPFS(
          JSON.stringify({
            title: values.title,
            about: values.about,
            keywords: values.keywords,
            role: 'buyer',
            rateToken: values.rateToken,
            rateAmount: parsedRateAmount,
          }),
        );

        const contract = new ethers.Contract(
          '0xE5054E2e59B284CA09713418451709E0CEb4116b',
          ServiceRegistry.abi,
          signer,
        );
        const tx = await contract.createServiceFromBuyer('1', user?.id, uri);
        const receipt = await provider.waitForTransaction(tx.hash);
        setSubmitting(false);

        if (receipt.status === 1) {
          console.log('success');
          setHasSucceed(true);
        } else {
          console.log('error');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      openConnectModal();
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      about: '',
      keywords: '',
      rateToken: '',
      rateAmount: '',
    },
    enableReinitialize: true,
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      title: Yup.string().required('title is required'),
      about: Yup.string().required('about is required'),
      keywords: Yup.string().required('keywords are required'),
      rateToken: Yup.string().required('rate is required'),
      rateAmount: Yup.string().required('amount is required'),
    }),
  });
  const { errors, isValid, handleChange, handleSubmit, values, handleBlur, isSubmitting } = formik;

  console.debug('Form debug: ', { errors, isValid, hasSucceed });

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid grid-cols-1 gap-6 py-4'>
        <label className='block'>
          <span className='text-gray-700'>Title</span>
          <input
            type='text'
            id='title'
            name='title'
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            placeholder=''
          />
        </label>

        <label className='block'>
          <span className='text-gray-700'>About</span>
          <textarea
            id='about'
            name='about'
            value={values.about}
            onChange={handleChange}
            onBlur={handleBlur}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            placeholder=''
          />
        </label>

        <label className='block'>
          <span className='text-gray-700'>Keywords</span>
          <input
            type='text'
            id='keywords'
            name='keywords'
            value={values.keywords}
            onChange={handleChange}
            onBlur={handleBlur}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            placeholder='keyword1, keyword2...'
          />
        </label>

        <div className='flex'>
          <label className='block flex-1 mr-4'>
            <span className='text-gray-700'>Amount</span>
            <input
              type='number'
              id='rateAmount'
              name='rateAmount'
              value={values.rateAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              placeholder=''
            />
          </label>

          <label className='block'>
            <span className='text-gray-700'>Token</span>
            <select
              id='rateToken'
              name='rateToken'
              value={values.rateToken}
              onChange={handleChange}
              onBlur={handleBlur}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              placeholder=''>
              <option value=''>Select a token</option>
              {tokens.map((token, index) => (
                <option key={index} value={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type='submit'
          className='px-5 py-2 border border-indigo-600 rounded-md hover:text-indigo-600 hover:bg-white text-white bg-indigo-600'>
          {'Create'}
        </button>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

export default ServiceForm;

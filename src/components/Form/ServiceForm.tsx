import { useAccount, useConnectModal, useNetwork, useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { CONST } from '../../constants';
import TalentLayerContext from '../../context/talentLayer';
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
  const { open: openConnectModal } = useConnectModal();
  const { provider } = useProvider();
  const [hasSucceed, setHasSucceed] = useState(false);
  const { account, signer } = useContext(TalentLayerContext);

  console.log({ signer, account });

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    console.log('onSubmit', values);
    if (account?.isConnected === true && provider !== undefined && signer !== undefined) {
      try {
        console.log(provider);
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
          signer,
        );
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
        const tx = await contract.createOpenServiceFromBuyer('1', uri);
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

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 py-4'>
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
                  {tokens.map((token, index) => (
                    <option key={index} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                </Field>
              </label>
            </div>

            <SubmitButton isSubmitting={isSubmitting} />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ServiceForm;

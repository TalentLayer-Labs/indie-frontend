import { BigNumber, BigNumberish, ethers, FixedNumber } from 'ethers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { usePublicClient, useWalletClient } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import ServiceRegistry from '../../contracts/ABI/TalentLayerService.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import { parseRateAmount } from '../../utils/web3';
import SubmitButton from './SubmitButton';
import useAllowedTokens from '../../hooks/useAllowedTokens';
import { getServiceSignature } from '../../utils/signature';
import { IToken } from '../../types';
import useServiceById from '../../hooks/useServiceById';
import { SkillsInput } from './skills-input';
import { delegateCreateService, delegateUpdateService } from '../request';

interface IFormValues {
  title: string;
  about: string;
  keywords: string;
  rateToken: string;
  rateAmount: number;
}

function ServiceForm({ serviceId }: { serviceId?: string }) {
  const { user, account } = useContext(TalentLayerContext);
  const provider = usePublicClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const { data: signer } = useWalletClient({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const existingService = useServiceById(serviceId as string);

  const router = useRouter();
  const allowedTokenList = useAllowedTokens();
  const existingToken = allowedTokenList.find(value => {
    return value.address === existingService?.description?.rateToken;
  });
  const [selectedToken, setSelectedToken] = useState<IToken>();
  const { isActiveDelegate } = useContext(TalentLayerContext);

  const initialValues: IFormValues = {
    title: existingService?.description?.title || '',
    about: existingService?.description?.about || '',
    keywords: existingService?.description?.keywords_raw || '',
    rateToken: existingService?.description?.rateToken || '',
    rateAmount:
      existingService?.description?.rateAmount &&
      allowedTokenList &&
      existingToken &&
      existingToken.decimals
        ? Number(
            ethers.utils.formatUnits(
              BigNumber.from(existingService?.description?.rateAmount),
              existingToken.decimals,
            ),
          )
        : 0,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Please provide a title for your service'),
    about: Yup.string().required('Please provide a description of your service'),
    keywords: Yup.string().required('Please provide keywords for your service'),
    rateToken: Yup.string().required('Please select a payment token'),
    rateAmount: Yup.number()
      .required('Please provide an amount for your service')
      .when('rateToken', {
        is: (rateToken: string) => rateToken !== '',
        then: schema =>
          schema.moreThan(
            selectedToken
              ? FixedNumber.from(
                  ethers.utils.formatUnits(
                    selectedToken?.minimumTransactionAmount as BigNumberish,
                    selectedToken?.decimals,
                  ),
                ).toUnsafeFloat()
              : 0,
            `Amount must be greater than ${
              selectedToken
                ? FixedNumber.from(
                    ethers.utils.formatUnits(
                      selectedToken?.minimumTransactionAmount as BigNumberish,
                      selectedToken?.decimals,
                    ),
                  ).toUnsafeFloat()
                : 0
            }`,
          ),
      }),
  });

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    const token = allowedTokenList.find(token => token.address === values.rateToken);
    if (account?.isConnected === true && provider && signer && token && user) {
      try {
        const parsedRateAmount = await parseRateAmount(
          values.rateAmount.toString(),
          values.rateToken,
          token.decimals,
        );
        const parsedRateAmountString = parsedRateAmount.toString();
        const cid = await postToIPFS(
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

        // Get platform signature
        const signature = await getServiceSignature({ profileId: Number(user?.id), cid });

        let tx;

        if (isActiveDelegate) {
          const response = existingService
            ? await delegateUpdateService(user.id, user.address, existingService.id, cid)
            : await delegateCreateService(user.id, user.address, cid);
          tx = response.data.transaction;
        } else {
          tx = existingService
            ? await contract.updateServiceData(user?.id, existingService.id, cid)
            : await contract.createService(
                user?.id,
                process.env.NEXT_PUBLIC_PLATFORM_ID,
                cid,
                signature,
              );
        }

        const newId = await createMultiStepsTransactionToast(
          {
            pending: `${existingService ? 'Updating' : 'Creating'} your job...`,
            success: `Congrats! Your job has been ${existingService ? 'updated' : 'created'} !`,
            error: `An error occurred while ${existingService ? 'Updating' : 'Creating'} your job`,
          },
          provider,
          tx,
          'service',
          cid,
        );
        setSubmitting(false);
        resetForm();
        if (newId) {
          router.push(`/services/${newId}`);
        }
      } catch (error) {
        showErrorTransactionToast(error);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
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

            <label className='block'>
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

            <label className='block'>
              <span className='text-gray-700'>Keywords</span>

              <SkillsInput
                initialValues={existingService?.description?.keywords_raw}
                entityId={'keywords'}
              />

              <Field type='hidden' id='keywords' name='keywords' />
            </label>

            <div className='flex'>
              <label className='block flex-1 mr-4'>
                <span className='text-gray-700'>Amount</span>
                <Field
                  type='number'
                  id='rateAmount'
                  name='rateAmount'
                  className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''
                />
                <span className='text-red-500 mt-2'>
                  <ErrorMessage name='rateAmount' />
                </span>
              </label>
              <label className='block'>
                <span className='text-gray-700'>Token</span>
                <Field
                  component='select'
                  id='rateToken'
                  name='rateToken'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''
                  onChange={(e: { target: { value: string } }) => {
                    const token = allowedTokenList.find(token => token.address === e.target.value);
                    setSelectedToken(token);
                    setFieldValue('rateToken', e.target.value);
                  }}>
                  <option value=''>Select a token</option>
                  {allowedTokenList.map((token, index) => (
                    <option key={index} value={token.address}>
                      {token.symbol}
                    </option>
                  ))}
                </Field>
                <span className='text-red-500'>
                  <ErrorMessage name='rateToken' />
                </span>
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

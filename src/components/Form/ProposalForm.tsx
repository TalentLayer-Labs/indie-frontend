import { ethers, FixedNumber } from 'ethers';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { IProposal, IService, IUser } from '../../types';
import { postToIPFS } from '../../utils/ipfs';
import { parseRateAmount } from '../../utils/web3';
import ServiceItem from '../ServiceItem';
import SubmitButton from './SubmitButton';
import useAllowedTokens from '../../hooks/useAllowedTokens';
import { useContext } from 'react';
import TalentLayerContext from '../../context/talentLayer';
import { createOrUpdateProposal } from '../../contracts/createOrUpdateProposal';

interface IFormValues {
  about: string;
  rateAmount: number;
  expirationDate: number;
  videoUrl: string;
  referrerId: number;
}

const validationSchema = Yup.object({
  about: Yup.string().required('Please provide a description of your service'),
  rateAmount: Yup.string().required('Please provide an amount for your service'),
  expirationDate: Yup.number().integer().required('Please provide an expiration date'),
});

function ProposalForm({
  user,
  service,
  existingProposal,
}: {
  user: IUser;
  service: IService;
  existingProposal?: IProposal;
}) {
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const router = useRouter();
  const allowedTokenList = useAllowedTokens();
  const { isActiveDelegate } = useContext(TalentLayerContext);

  if (allowedTokenList.length === 0) {
    return <div>Loading...</div>;
  }

  //Store referrerId in local storage if any
  if (router.query.referrerId) {
    localStorage.setItem(`${service.id}-${user.id}`, router.query.referrerId as string);
  }

  let existingExpirationDate, existingRateTokenAmount;

  if (existingProposal) {
    existingExpirationDate = Math.floor(
      (Number(existingProposal?.expirationDate) - Date.now() / 1000) / (60 * 60 * 24),
    );

    const token = allowedTokenList.find(token => token.address === service.rateToken.address);

    existingRateTokenAmount = FixedNumber.from(
      ethers.utils.formatUnits(existingProposal.rateAmount, token?.decimals),
    ).toUnsafeFloat();
  }

  const initialValues: IFormValues = {
    about: existingProposal?.description?.about || '',
    rateAmount: existingRateTokenAmount || 0,
    expirationDate: existingExpirationDate || 15,
    videoUrl: existingProposal?.description?.video_url || '',
    referrerId:
      (service.referralAmount &&
        (Number(localStorage.getItem(`${service.id}-${user.id}`)) ||
          Number(router.query.referrerId as string) ||
          Number(existingProposal?.referrer?.id))) ||
      0,
  };

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    const token = allowedTokenList.find(token => token.address === service.rateToken.address);
    if (provider && signer && token) {
      const parsedRateAmount = await parseRateAmount(
        values.rateAmount.toString(),
        service.rateToken.address,
        token.decimals,
      );
      const now = Math.floor(Date.now() / 1000);
      const convertExpirationDate = now + 60 * 60 * 24 * values.expirationDate;
      const convertExpirationDateString = convertExpirationDate.toString();

      const cid = await postToIPFS(
        JSON.stringify({
          about: values.about,
          video_url: values.videoUrl,
        }),
      );

      await createOrUpdateProposal(
        signer,
        provider,
        router,
        user.id,
        user.address,
        values.referrerId.toString(),
        service.id,
        convertExpirationDateString,
        !!existingProposal,
        parsedRateAmount,
        cid,
        isActiveDelegate,
        setSubmitting,
        resetForm,
      );
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <h2 className='mb-2 text-gray-900 font-bold'>For the job:</h2>
          <ServiceItem service={service} />

          <h2 className=' mt-8 mb-2 text-gray-900 font-bold'>Describe your proposal in details:</h2>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>about</span>
              <Field
                as='textarea'
                id='about'
                rows={8}
                name='about'
                className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='about' />
              </span>
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
                <span className='text-red-500'>
                  <ErrorMessage name='rateAmount' />
                </span>
              </label>
              <label className='block'>
                <span className='text-gray-700'>Token</span>
                <p className='my-2 block w-full text-gray-500'>{service.rateToken.symbol}</p>
                <span className='text-red-500'>
                  <ErrorMessage name='rateToken' />
                </span>
              </label>
            </div>
            <label className='block flex-1'>
              <span className='text-gray-700'>Expiration Date (Days)</span>
              <Field
                type='number'
                id='expirationDate'
                name='expirationDate'
                className='mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='expirationDate' />
              </span>
            </label>
            <label className='block flex-1'>
              <span className='text-gray-700'>Video URL (optional)</span>
              <Field
                type='text'
                id='videoUrl'
                name='videoUrl'
                className='mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder='Enter  video URL'
              />
              <span className='text-red-500'>
                <ErrorMessage name='videoUrl' />
              </span>
            </label>
            {!!Number(service.referralAmount) && (
              <>
                <label className='block flex-1'>
                  <span className='text-gray-700'>Referrer id (optional)</span>
                  <Field
                    type='text'
                    id='referrerId'
                    name='referrerId'
                    className='mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    placeholder='TalentLayer id of referrer'
                  />
                  <span className='text-red-500'>
                    <ErrorMessage name='referrerId' />
                  </span>
                </label>
              </>
            )}

            <SubmitButton isSubmitting={isSubmitting} label='Post' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProposalForm;

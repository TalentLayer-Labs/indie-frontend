import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerPlatformID from '../../contracts/ABI/TalentLayerPlatformID.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import Loading from '../Loading';
import SubmitButton from './SubmitButton';

interface IFormValues {
  name?: string;
  website?: string;
  about?: string;
  image_url?: string;
  video_url?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required('platform name is required'),
});

function ConfigurationPresentationForm() {
  const { open: openConnectModal } = useWeb3Modal();
  const { platform } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });

  if (!platform?.id) {
    return <Loading />;
  }

  const initialValues: IFormValues = {
    name: platform?.name || '',
    about: platform?.description?.about || '',
    website: platform?.description?.website || '',
    image_url: platform?.description?.image_url || '',
    video_url: platform?.description?.video_url || '',
  };

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    console.log('values', values);
    if (platform && provider && signer) {
      try {
        const cid = await postToIPFS(
          JSON.stringify({
            name: values.name,
            about: values.about,
            website: values.website,
            image_url: values.image_url,
            video_url: values.video_url,
          }),
        );

        console.log('cid', cid);

        const contract = new ethers.Contract( // FIXME
          config.contracts.talentLayerPlatformId,
          TalentLayerPlatformID.abi,
          signer,
        );
        const tx = await contract.updateProfileData(platform.id, cid);

        console.log('tx', tx);

        await createMultiStepsTransactionToast(
          {
            pending: 'Updating platform ...',
            success: 'Congrats! Your platform infos has been updated',
            error: 'An error occurred while updating your platform',
          },
          provider,
          tx,
          'platform',
          cid,
        );

        setSubmitting(false);
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
      {({ isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>Name</span>
              <Field
                type='text'
                id='name'
                name='name'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <label className='block'>
              <span className='text-gray-700'>Website</span>
              <Field
                type='text'
                id='website'
                name='website'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder='platform.io'
              />
            </label>

            <label className='block'>
              <span className='text-gray-700'>About</span>
              <Field
                as='textarea'
                id='about'
                name='about'
                rows='5'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <label className='block'>
              <span className='text-gray-700'>Logo (url)</span>
              <Field
                type='url'
                id='image_url'
                name='image_url'
                rows='8'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <label className='block'>
              <span className='text-gray-700'>Video presentation (url)</span>
              <Field
                type='url'
                id='video_url'
                name='video_url'
                rows='8'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Update' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ConfigurationPresentationForm;

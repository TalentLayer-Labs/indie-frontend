import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { useConnectModal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/TalentLayerID.json';
import useUserDetails from '../../hooks/useUserDetails';
import postToIPFS from '../../services/ipfs';
import SubmitButton from './SubmitButton';

interface IFormValues {
  title?: string;
  about?: string;
  skills?: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
});

function ProfileForm() {
  const { open: openConnectModal } = useConnectModal();
  const { user, signer, provider } = useContext(TalentLayerContext);
  const userDetails = useUserDetails(user?.uri);

  if (user?.uri && !userDetails) {
    return <p>loading...</p>;
  }

  const initialValues: IFormValues = {
    title: userDetails?.title || '',
    about: userDetails?.about || '',
    skills: userDetails?.skills || '',
  };

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
            title: values.title,
            about: values.about,
            skills: values.skills,
          }),
        );

        const contract = new ethers.Contract(
          '0x97aa4622Aeda18CAF5c797C1E5285Bd5c6fc145D',
          TalentLayerID.abi,
          signer,
        );
        const tx = await contract.updateProfileData(user.id, uri);
        const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
          pending: 'Your transaction is pending',
          success: 'Congrats! Your profile has been updated',
          error: 'An error occurred while updating your profile',
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
              <span className='text-gray-700'>Skills</span>
              <Field
                type='text'
                id='skills'
                name='skills'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder='skill1, skill2...'
              />
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Update' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ProfileForm;
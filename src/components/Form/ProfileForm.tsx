import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import { postToIPFS } from '../../utils/ipfs';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import Loading from '../Loading';
import SubmitButton from './SubmitButton';
import useUserById from '../../hooks/useUserById';
import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';

interface IFormValues {
  title?: string;
  role?: string;
  image_url?: string;
  video_url?: string;
  name?: string;
  about?: string;
  skills?: string;
}

const validationSchema = Yup.object({
  title: Yup.string().required('title is required'),
});

function ProfileForm({ callback }: { callback?: () => void }) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const userDescription = user?.id ? useUserById(user?.id)?.description : null;
  const [editor] = useState(() => withReact(createEditor()));
  const { setFieldValue } = useFormikContext();

  const initialSlateValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ];

  const { data: signer } = useSigner({
    chainId: import.meta.env.VITE_NETWORK_ID,
  });

  if (!user?.id) {
    return <Loading />;
  }

  const initialValues: IFormValues = {
    title: userDescription?.title || '',
    role: userDescription?.role || '',
    image_url: userDescription?.image_url || '',
    video_url: userDescription?.video_url || '',
    name: userDescription?.name || '',
    about: userDescription?.about || '',
    skills: userDescription?.skills_raw || '',
  };

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (user && provider && signer) {
      try {
        const cid = await postToIPFS(
          JSON.stringify({
            title: values.title,
            role: values.role,
            image_url: values.image_url,
            video_url: values.video_url,
            name: values.name,
            about: values.about,
            skills: values.skills,
          }),
        );

        const contract = new ethers.Contract(
          config.contracts.talentLayerId,
          TalentLayerID.abi,
          signer,
        );

        const tx = await contract.updateProfileData(user.id, cid);
        await createMultiStepsTransactionToast(
          {
            pending: 'Updating profile...',
            success: 'Congrats! Your profile has been updated',
            error: 'An error occurred while updating your profile',
          },
          provider,
          tx,
          'user',
          cid,
        );

        if (callback) {
          callback();
        }

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
              <span className='text-gray-700'>Title</span>
              <Field
                type='text'
                id='title'
                name='title'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>
            <label className='block hidden'>
              <span className='text-gray-700'>Name</span>
              <Field
                type='text'
                id='name'
                name='name'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>
            <label className='block hidden'>
              <span className='text-gray-700'>Role</span>
              <Field
                as='select'
                id='role'
                name='role'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''>
                <option value=''></option>
                <option value='buyer'>Buyer</option>
                <option value='seller'>Seller</option>
                <option value='buyer-seller'>Both</option>
              </Field>
            </label>

            <label className='block'>
              <span className='text-gray-700'>About</span>
              <Field
                id='about'
                type='hidden'
                name='about'
                rows='4'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
            </label>

            <Slate
              editor={editor}
              value={initialSlateValue}
              onChange={value => {
                const isAstChange = editor.operations.some(op => 'set_selection' !== op.type);
                if (isAstChange) {
                  // Save the value to Local Storage.
                  const content = JSON.stringify(value);
                  setFieldValue('about', content); // Set the custom value for the 'about' field
                }
              }}>
              <Editable />
            </Slate>
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

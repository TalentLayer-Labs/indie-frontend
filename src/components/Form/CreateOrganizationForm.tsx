import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { ErrorMessage, Field, Form, Formik, FieldArray } from 'formik';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import {
  createMultiStepsTransactionToast,
  createTransactionToast,
  showErrorTransactionToast,
} from '../../utils/toast';
import Loading from '../Loading';
import SubmitButton from './SubmitButton';
import { useRouter } from 'next/router';
import { deploySafe, proposeSafeTransaction } from '../../contracts/safe/Organisations';
import { getUserIdsByAddresses } from '../../queries/users';
import { generateSelector } from '../../utils/web3';
import { IUser } from '../../types';
import { postToIPFS } from '../../utils/ipfs';

interface IFormValues {
  handle?: string;
  members?: string[];
}

const validationSchema = Yup.object({
  handle: Yup.string().required('Handle is required'),
  members: Yup.array().of(Yup.string().required('Member is required')),
});

function CreateOrganizationForm({
  congrats,
  setCongrats,
}: {
  congrats?: boolean;
  setCongrats: Dispatch<SetStateAction<boolean>>;
}) {
  const { open: openConnectModal } = useWeb3Modal();
  const { user } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string) });
  const { data: signer } = useSigner({
    chainId: parseInt(process.env.NEXT_PUBLIC_NETWORK_ID as string),
  });
  const router = useRouter();

  if (!user?.id) {
    return <Loading />;
  }

  const initialValues: IFormValues = {
    handle: '',
    members: [''],
  };

  const onSubmit = async (
    values: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (user && provider && signer && values.members) {
      console.log('values: ', values);
      try {
        const contract = new ethers.Contract(
          config.contracts.talentLayerId,
          TalentLayerID.abi,
          signer,
        );

        const handlePrice = await contract.getHandlePrice(values.handle);

        // Create Multisig Safe
        // const safeAddress = '0x1ea68C3A0e1F328343fFF5f16528B297DEa4E4dB';
        const safeAddress = await deploySafe(values.members, signer, 1);

        if (safeAddress) {
          // TODO Fund the safe

          // Mint ID for organization
          const mintTx = await contract.mintForAddress(
            safeAddress,
            process.env.NEXT_PUBLIC_PLATFORM_ID,
            values.handle,
            {
              value: handlePrice,
            },
          );

          //TODO newID undefined
          const newId = await createMultiStepsTransactionToast(
            {
              pending: 'Creating organization profile...',
              success: 'Congrats! Your organization has been created',
              error: 'An error occurred while creating your organization',
            },
            provider,
            mintTx,
            'user',
          );
          console.log('newId', newId);
          const memberIds = await getMembersIds(values.members);

          // Create ipfs metaData
          // const cid = 'QmWuF9qodtLgP4e6dbQLESiBpotqMyqCRoTMW7CeQaC9qT';
          const cid = await postToIPFS(
            JSON.stringify({
              //     // title: values.title,
              //     // role: values.role,
              //     // image_url: values.image_url,
              //     // video_url: values.video_url,
              //     // name: values.name,
              //     // about: values.about,
              //     // skills: values.skills,
              //     // TOTO get user ids here
              members: memberIds,
            }),
          );
          console.log('cid', cid);

          // Update metaData using multisig
          const functionSelector = generateSelector(
            'updateProfileData(uint256,string)',
            TalentLayerID.abi,
            TalentLayerID.bytecode,
            [newId, cid],
          );

          console.log('functionSelector', functionSelector);

          const updateTx = await proposeSafeTransaction(
            safeAddress,
            config.contracts.talentLayerId,
            signer,
            '0',
            functionSelector,
          );

          if (updateTx) {
            createTransactionToast('Your safe transaction has been proposed', updateTx);
          } else {
            console.error('Transaction failed');
          }

          // Then redirect to organization dashboard
          if (newId) {
            // router.push('/organizations/edit/' + newId);
            setCongrats(true);
          }
        }

        setSubmitting(false);
      } catch (error) {
        showErrorTransactionToast(error);
      }
    } else {
      openConnectModal();
    }
  };

  async function getMembersIds(members: string[]) {
    const response = await getUserIdsByAddresses(members);
    const users: IUser[] = response.data.data.users;
    const memberIds: string[] = [];
    users.forEach(user => {
      memberIds.push(user.id);
    });
    return memberIds;
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {({ isSubmitting, values }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6 border border-gray-200 rounded-md p-8'>
            <label className='block'>
              <span className='text-gray-700'>Handle</span>
              <Field
                type='text'
                id='handle'
                name='handle'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='handle' />
              </span>
            </label>

            <FieldArray name='members'>
              {({ insert, remove, push }) => (
                <div className={'ml-5'}>
                  {values.members &&
                    values.members.length > 0 &&
                    values.members.map((member, index) => (
                      <div className='flex flex-row' key={index}>
                        <div className=''>
                          <label className={'text-gray-700'}>Signer {index + 1}</label>
                          <Field
                            name={`members.${index}`}
                            placeholder='0x...'
                            className='mt-1 block w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                            type='text'
                          />
                          <span className='text-red-500'>
                            <ErrorMessage name='about' />
                          </span>
                        </div>
                        {/*Reposition X*/}

                        <button
                          onClick={() => remove(index)}
                          type='button'
                          className='mt-6 ml-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center '
                          data-modal-toggle='defaultModal'>
                          <svg
                            className='w-5 h-5'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              fillRule='evenodd'
                              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                              clipRule='evenodd'></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  {/*TODO Change Button colors*/}
                  <button
                    type='button'
                    className='mt-5 px-5 py-2 rounded-md hover:bg-il-green-main text-il-green-800 bg-il-green-200 duration-100'
                    onClick={() => {
                      console.log('values', values);
                      push('');
                    }}>
                    Add address
                  </button>
                </div>
              )}
            </FieldArray>

            {/*TODO Threshold input to finalize*/}
            <label className='block hidden'>
              <span className='text-gray-700'>Threshhold</span>
              <Field
                as='select'
                id='threshhold'
                name='threshhold'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''>
                <option value=''></option>
                <option value=''></option>
                <option value=''></option>
              </Field>
            </label>

            <SubmitButton isSubmitting={isSubmitting} label='Update' />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateOrganizationForm;

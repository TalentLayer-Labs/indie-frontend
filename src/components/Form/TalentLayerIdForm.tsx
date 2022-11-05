import { useAccount, useConnectModal, useProvider, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import TalentLayerID from '../../contracts/TalentLayerID.json';
import SubmitButton from './SubmitButton';

interface IFormValues {
  handle: string;
}

function TalentLayerIdForm() {
  const { account } = useAccount();
  const { open: openConnectModal } = useConnectModal();
  const { data: signer } = useSigner();
  const { provider } = useProvider();
  const [hasSucceed, setHasSucceed] = useState(false);

  const onSubmit = async (
    submittedValues: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (account.isConnected === true && provider) {
      const contract = new ethers.Contract(
        '0x97aa4622Aeda18CAF5c797C1E5285Bd5c6fc145D',
        TalentLayerID.abi,
        signer,
      );
      const tx = await contract.mint('1', submittedValues.handle);
      const receipt = await provider.waitForTransaction(tx.hash);
      setSubmitting(false);

      if (receipt.status === 1) {
        console.log('success');
        setHasSucceed(true);
      } else {
        console.log('error');
      }
    } else {
      openConnectModal();
    }
  };

  const formik = useFormik({
    initialValues: {
      handle: '',
    },
    enableReinitialize: true,
    onSubmit: onSubmit,
    validationSchema: Yup.object().shape({
      handle: Yup.string()
        .min(2)
        .max(10)
        .when('isConnected', {
          is: account.isConnected,
          then: schema => schema.required('handle is required'),
        }),
    }),
  });
  const { errors, isValid, handleChange, handleSubmit, values, handleBlur, isSubmitting } = formik;

  console.debug({ errors, isValid, hasSucceed });

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex divide-x bg-white py-4 px-1 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded-full'>
        <div className='sm:px-6 flex flex-row items-center gap-2'>
          <span className='text-gray-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
              />
            </svg>
          </span>
          <input
            className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg border-0'
            type='text'
            placeholder='Choose your handle'
            id='handle'
            name='handle'
            value={values.handle}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>

        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}

export default TalentLayerIdForm;

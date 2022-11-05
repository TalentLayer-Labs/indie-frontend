import { useAccount, useConnectModal, useProvider, useSigner } from '@web3modal/react';
import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ethers } from 'ethers';
import TalentLayerID from '../../contracts/TalentLayerID.json';

function CreateId() {
  const { account } = useAccount();
  const { open: openConnectModal } = useConnectModal();
  const { data: signer, error, isLoading, refetch } = useSigner();
  const { provider } = useProvider();
  const [hasSucceed, setHasSucceed] = useState(false);

  // @ts-ignore - TODO: handle typing for submittedValues
  const onSubmit = async (submittedValues, { setSubmitting }) => {
    if (account.isConnected && provider) {
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

  return (
    <>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto text-gray-900 px-4 lg:px-0 py-20'>
          <div className='flex flex-col items-center justify-center gap-10'>
            <p className='text-7xl font-medium tracking-wider max-w-lg text-center'>
              Create <span className='text-indigo-600'>Your </span> TalentLayer ID
            </p>

            <p className='text-gray-500 text-center'>
              Own your reputation as an indie freelancer.
              <br />
              Onboard your clients, leave mutual reviews, and grow your reputation.
            </p>

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
                    className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg'
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

                <div className='sm:px-4 flex flex-row  sm:space-x-4 justify-between items-center'>
                  {isSubmitting ? (
                    <button
                      disabled
                      type='submit'
                      className='py-2 px-5 mr-2 rounded-full text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center'>
                      <svg
                        role='status'
                        className='inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600'
                        viewBox='0 0 100 101'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                          fill='currentColor'
                        />
                        <path
                          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                          fill='#1C64F2'
                        />
                      </svg>
                      Loading...
                    </button>
                  ) : account.isConnected ? (
                    <button
                      type='submit'
                      className='px-5 py-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-600'>
                      {'Create'}
                    </button>
                  ) : (
                    <button
                      onClick={openConnectModal}
                      type='button'
                      className='px-5 py-2 border border-indigo-600 rounded-full hover:text-indigo-600 hover:bg-white text-white bg-indigo-600'>
                      {'Connect first'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {hasSucceed && (
        <div
          id='toast-success'
          className='fixed bottom-2 right-2 flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800'
          role='alert'>
          <div className='inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200'>
            <svg
              className='w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'></path>
            </svg>
            <span className='sr-only'>Check icon</span>
          </div>
          <div className='ml-3 text-sm font-normal'>TalentLayer ID created successfully.</div>
          <button
            type='button'
            className='ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
            data-dismiss-target='#toast-success'>
            <span className='sr-only'>Close</span>
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
      )}
    </>
  );
}

export default CreateId;

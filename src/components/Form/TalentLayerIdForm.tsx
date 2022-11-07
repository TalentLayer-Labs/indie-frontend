import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { useConnectModal, useNetwork, useSigner } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/TalentLayerID.json';
import SubmitButton from './SubmitButton';

interface IFormValues {
  handle: string;
}

const initialValues: IFormValues = {
  handle: '',
};

function TalentLayerIdForm() {
  const { open: openConnectModal } = useConnectModal();
  const { account, provider } = useContext(TalentLayerContext);
  const { data: signer, refetch: refetchSigner } = useSigner();
  const { isReady: networkIsReady } = useNetwork();

  useEffect(() => {
    (async () => {
      if (networkIsReady) {
        console.log('refretch');
        await refetchSigner({ chainId: 5 });
      }
    })();
  }, [networkIsReady]);

  const validationSchema = Yup.object().shape({
    handle: Yup.string()
      .min(2)
      .max(10)
      .when('isConnected', {
        is: account && account.isConnected,
        then: schema => schema.required('handle is required'),
      }),
  });

  const onSubmit = async (
    submittedValues: IFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (account && account.isConnected === true && provider) {
      try {
        const contract = new ethers.Contract(
          '0x97aa4622Aeda18CAF5c797C1E5285Bd5c6fc145D',
          TalentLayerID.abi,
          signer,
        );
        const tx = await contract.mint('1', submittedValues.handle);
        const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
          pending: 'Your transaction is pending',
          success: 'Transaction resolved',
          error: 'Transaction rejected',
        });

        setSubmitting(false);

        if (receipt.status === 1) {
          toast.success(`Congrats ${submittedValues.handle}! Your Talent Layer Id is minted`);
        } else {
          console.log('error');
        }
      } catch (error) {
        const parsedEthersError = getParsedEthersError(error as EthersError);
        toast.error(`${parsedEthersError.errorCode} - ${parsedEthersError.context}`);
        console.log(error);
      }
    } else {
      openConnectModal();
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <div className='flex divide-x bg-white py-4 px-4 sm:px-0 justify-center items-center flex-row drop-shadow-lg rounded-lg'>
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
              <Field
                type='text'
                className='text-gray-500 py-2 focus:ring-0 outline-none text-sm sm:text-lg border-0'
                placeholder='Choose your handle'
                id='handle'
                name='handle'
                required
              />
            </div>

            <div className='sm:px-4 sm:space-x-4'>
              <SubmitButton isSubmitting={isSubmitting} />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default TalentLayerIdForm;

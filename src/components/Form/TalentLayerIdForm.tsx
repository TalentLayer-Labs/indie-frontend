import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerID from '../../contracts/ABI/TalentLayerID.json';
import TransactionToast from '../TransactionToast';
import SubmitButton from './SubmitButton';

interface IFormValues {
  handle: string;
}

const initialValues: IFormValues = {
  handle: '',
};

function TalentLayerIdForm() {
  const { open: openConnectModal } = useWeb3Modal();
  const { account } = useContext(TalentLayerContext);
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const navigate = useNavigate();

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
    if (account && account.isConnected && provider && signer) {
      try {
        const contract = new ethers.Contract(
          config.contracts.talentLayerId,
          TalentLayerID.abi,
          signer,
        );

        const tx = await contract.mint(import.meta.env.VITE_PLATFORM_ID, submittedValues.handle);
        const receipt = await toast.promise(provider.waitForTransaction(tx.hash), {
          pending: {
            render() {
              return (
                <TransactionToast message='Your update is in progress' transactionHash={tx.hash} />
              );
            },
          },
          success: 'Transaction resolved',
          error: `Congrats ${submittedValues.handle}! Your Talent Layer Id is minted`,
        });

        setSubmitting(false);

        if (receipt.status === 1) {
          toast.promise(
            new Promise(resolve =>
              setTimeout(() => {
                navigate(0);
                resolve(true);
              }, 20000),
            ),
            {
              pending: 'Refreshing your data',
            },
          );
        } else {
          console.error('error');
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

import { BigNumber } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { config } from '../../config';
import { releasePayment } from '../../contracts/releasePayment';
import { IService, ServiceStatusEnum } from '../../types';
import { renderTokenAmount } from '../../utils/conversion';

interface IFormValues {
  pourcentField: string;
}

interface IReleaseFormProps {
  totalInEscrow: BigNumber;
  rateToken: string;
  service: IService;
  isBuyer: boolean;
  closeModal: () => void;
}

function ReleaseForm({
  totalInEscrow,
  rateToken,
  service,
  closeModal,
  isBuyer,
}: IReleaseFormProps) {
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const [pourcent, setPourcentage] = useState(0);
  const symbol = config.tokens[rateToken].symbol;

  const handleSubmit = async (values: any) => {
    if (!signer || !provider) {
      return;
    }
    const pourcentToToken = totalInEscrow.mul(pourcent).div(100);

    await releasePayment(signer, provider, service.transactionId, pourcentToToken);
    closeModal();
  };

  const releaseMax = () => {
    setPourcentage(100);
  };

  const releaseMin = () => {
    setPourcentage(1);
  };

  const onChange = (e: any) => {
    const pourcentOnChange = e.target.value;
    if (pourcentOnChange <= 100 && pourcentOnChange >= 0) {
      setPourcentage(pourcentOnChange);
    }
  };

  const amountSelected = useMemo(() => {
    return pourcent ? totalInEscrow.mul(pourcent).div(100) : '';
  }, [pourcent]);

  const initialValues: IFormValues = {
    pourcentField: '50',
  };

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col px-4 py-6 md:p-6 xl:p-6 w-full bg-gray-50 space-y-6'>
        {service.status === ServiceStatusEnum.Confirmed && (
          <h3 className='text-xl font-semibold leading-5 text-gray-800'>
            Select the pourcent to release
          </h3>
        )}
        <div className='flex space-x-2 flex-row'>
          <div className='items-center rounded-b border-gray-200 '>
            <button
              type='button'
              onClick={releaseMin}
              className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
              Min
            </button>
          </div>
          <div className='items-center  rounded-b border-gray-200 '>
            <button
              type='button'
              onClick={releaseMax}
              className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
              Max
            </button>
          </div>
        </div>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            <div className='sm:px-6 justify-between bg-white flex flex-row items-center gap-2'>
              <div>
                <span className='text-base font-semibold leading-4 text-gray-800'>% </span>
                <Field
                  type='number'
                  label='Pourcent'
                  className='text-gray-500 py-2 focus:outline-none text-sm sm:text-lg border-0'
                  placeholder='between 0 and 100'
                  id='pourcentField'
                  name='pourcentField'
                  required
                  value={pourcent ? pourcent : ''}
                  onChange={onChange}
                />
              </div>
              {
                <div className='pr-2 text-base font-semibold leading-4 text-gray-400  '>
                  {amountSelected && renderTokenAmount(rateToken, amountSelected.toString())}
                  {!amountSelected && '0 ' + `${symbol}`}
                </div>
              }
            </div>
            <div className='flex items-center pt-6 space-x-2 rounded-b border-gray-200 '>
              {isBuyer && totalInEscrow.gt(0) && (
                <button
                  type='submit'
                  className='text-green-600 bg-green-50 hover:bg-green-500 hover:text-white px-5 py-2 rounded-lg'>
                  Release the selected amount
                </button>
              )}
              <button
                onClick={closeModal}
                type='button'
                className='text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 '>
                Close
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ReleaseForm;

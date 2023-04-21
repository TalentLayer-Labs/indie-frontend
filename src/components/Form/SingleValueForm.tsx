import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useContext } from 'react';
import { useProvider, useSigner } from 'wagmi';
import * as Yup from 'yup';
import { config } from '../../config';
import TalentLayerContext from '../../context/talentLayer';
import TalentLayerPlatformID from '../../contracts/ABI/TalentLayerPlatformID.json';
import TalentLayerArbitrator from '../../contracts/ABI/TalentLayerArbitrator.json';
import { createMultiStepsTransactionToast, showErrorTransactionToast } from '../../utils/toast';
import Loading from '../Loading';
import SubmitButton from './SubmitButton';

interface IFormValuesNumber {
  value?: number;
}
interface IFormValuesString {
  value?: string;
}

export enum CustomValueTypes {
  EscrowFeesWorker = 'EscrowFeesWorker',
  EscrowFeesService = 'EscrowFeesService',
  ArbitrationFeeTimeout = 'ArbitrationFeeTimeout',
  ArbitrationPrice = 'ArbitrationPrice',
  DisputeStrategy = 'DisputeStrategy',
}

function SingleValueForm({
  customType,
  valueName,
}: {
  customType: CustomValueTypes;
  valueName: string;
}) {
  const { open: openConnectModal } = useWeb3Modal();
  const { platform } = useContext(TalentLayerContext);
  const provider = useProvider({ chainId: import.meta.env.VITE_NETWORK_ID });
  const { data: signer } = useSigner({ chainId: import.meta.env.VITE_NETWORK_ID });
  let valueType: string;
  let validationSchema;
  let initialValue = '';
  let selectOptions: { value: string; label: string }[] = [];
  let contractFunctionName: string;
  let contract: ethers.Contract;
  let decimals = 0;
  if (signer) {
    contract = new ethers.Contract(
      config.contracts.talentLayerPlatformId,
      TalentLayerPlatformID.abi,
      signer,
    );
  }

  if (!platform?.id || !signer) {
    return <Loading />;
  }

  switch (customType) {
    case 'EscrowFeesService': {
      contractFunctionName = 'updateOriginServiceFeeRate';
      initialValue = platform.originServiceFeeRate.toString();
      decimals = 3;
      validationSchema = Yup.object({
        value: Yup.number().required('value is required'),
      });
      valueType = 'number';
      break;
    }
    // TODO: update
    case 'EscrowFeesWorker': {
      contractFunctionName = 'updateOriginValidatedProposalFeeRate';
      initialValue = platform.originValidatedProposalFeeRate.toString();
      validationSchema = Yup.object({
        value: Yup.number().required('value is required'),
      });
      valueType = 'number';
      break;
    }
    case 'ArbitrationPrice': {
      contractFunctionName = 'setArbitrationPrice';
      validationSchema = Yup.object({
        value: Yup.number().required('value is required'),
      });
      valueType = 'number';
      contract = new ethers.Contract(
        config.contracts.talentLayerArbitrator,
        TalentLayerArbitrator.abi,
        signer,
      );
      break;
    }
    case 'ArbitrationFeeTimeout': {
      contractFunctionName = 'updateArbitrationFeeTimeout';
      initialValue = platform.arbitrationFeeTimeout;
      validationSchema = Yup.object({
        value: Yup.number().required('value is required'),
      });
      valueType = 'number';
      break;
    }
    // TODO: update
    case 'DisputeStrategy': {
      contractFunctionName = 'updateArbitrator';
      selectOptions = [
        { value: '0x0000000000000000000000000000000000000000', label: 'Self-Managed' },
        { value: '0x0000000000000000000000000000000000000000', label: 'Other' },
      ];
      validationSchema = Yup.object({
        value: Yup.number().required('value is required'),
      });
      valueType = 'select';
      break;
    }
  }

  const onSubmit = async (
    values: IFormValuesString | IFormValuesNumber | undefined,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    if (platform && provider && signer && values) {
      try {
        let value = values[valueName as keyof IFormValuesString];
        if (!value) {
          return;
        }
        if (valueType === 'number') {
          value = (value as number) * 10 ** decimals;
        }
        const tx = await contract[contractFunctionName](platform.id, value, null);

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
          '',
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
      initialValues={{ [valueName]: initialValue }}
      // validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <label className='block'>
            <span className='text-gray-700'>{valueName}</span>
            <div className='mt-1 flex rounded-md shadow-sm'>
              {customType === 'DisputeStrategy' && selectOptions ? (
                <Field
                  component='select'
                  id={valueName}
                  name={valueName}
                  className='mt-1 mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''>
                  <option value=''>Select a value</option>
                  {selectOptions.map((selectOption, index) => (
                    <option key={index} value={selectOption.value}>
                      {selectOption.label}
                    </option>
                  ))}
                </Field>
              ) : (
                <Field
                  type={valueType}
                  id={valueName}
                  name={valueName}
                  step='any'
                  className='mt-1 mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  placeholder=''
                />
              )}
              <SubmitButton isSubmitting={isSubmitting} label='Update' />
            </div>
          </label>
        </Form>
      )}
    </Formik>
  );
}

export default SingleValueForm;

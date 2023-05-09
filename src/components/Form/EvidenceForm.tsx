import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import SubmitButton from './SubmitButton';
import FileDropper from '../../modules/Kleros/components/FileDropper';
import { Evidence } from '../../modules/Kleros/utils/types';

interface IFormValues {
  title: string;
  about: string;
  file: File | null;
}

const initialValues: IFormValues = {
  title: '',
  about: '',
  file: null,
};

function EvidenceForm({
  evidences,
  setEvidences,
}: {
  evidences: Evidence[];
  setEvidences: Dispatch<SetStateAction<Evidence[]>>;
}) {
  const [fileSelected, setFileSelected] = useState<File>();
  // const [evidences, setEvidences] = useState<Evidence[]>([]);

  const router = useRouter();

  const validationSchema = Yup.object({
    title: Yup.string().required('Please provide a title for your evidence'),
    about: Yup.string().required('Please provide a description of your evidence'),
  });

  const onSubmit = async (values: IFormValues, { resetForm }: { resetForm: () => void }) => {
    //TODO Upload file to ipfs
    //TODO Get file extention
    //TODO Build evidence
    setEvidences([
      ...evidences,
      {
        fileURI: '',
        //TODO remove this
        fileHash: values.file?.name || '',
        fileTypeExtension: '',
        name: values.title,
        description: values.about,
      },
    ]);
    // formikProps.setFieldValue('evidences', evidences);
    resetForm();
    setFileSelected(undefined);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
      {({ isSubmitting }) => (
        <Form>
          <div className='grid grid-cols-1 gap-6'>
            <label className='block'>
              <span className='text-gray-700'>Title</span>
              <Field
                type='text'
                id='title'
                name='title'
                className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='title' />
              </span>
            </label>

            <label className='block'>
              <span className='text-gray-700'>About</span>
              <Field
                as='textarea'
                id='about'
                name='about'
                className='mt-1 mb-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                placeholder=''
              />
              <span className='text-red-500'>
                <ErrorMessage name='about' />
              </span>
            </label>

            <label className='block'>
              <FileDropper setFileSelected={setFileSelected} fileSelected={fileSelected} />

              <Field type='hidden' id='file' name='file' />
            </label>
            <div className='flex flex-row justify-between items-center ml-4 sm:ml-2'>
              <SubmitButton isSubmitting={isSubmitting} label='Add evidence' />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default EvidenceForm;

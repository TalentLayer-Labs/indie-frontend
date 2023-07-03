import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Toggle from '../Form/Toggle';
import { web3Mail, dataProtector } from '../request';

// Switch import statement will depend on your UI library or your custom component

function Web3Mail({
  showMailModal,
  setShowMailModal,
}: {
  showMailModal: boolean;
  setShowMailModal: Function;
}) {
  const [show, setShow] = useState(showMailModal);
  const [allowNotifications, setAllowNotifications] = useState(false);

  interface IFormValues {
    email: string;
  }

  useEffect(() => {
    setShow(showMailModal);
  }, [showMailModal]);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const onSubmit = async (
    values: IFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    },
  ) => {
    // const dataProtectorTest = await dataProtector({ data: { email: values.email } });
    // console.log(dataProtectorTest);

    const web3mail = await web3Mail(
      'bonjour',
      'test',
      '0x64e6da7C7d7dc300f6d7aC4BDddF182fb009677c',
    );
    console.log('web3mail', web3mail);

    setSubmitting(true);
    resetForm();
  };

  return (
    <>
      <div
        className={`${
          !show ? 'hidden' : ''
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-full bg-black/75 flex flex-col items-center justify-center`}>
        <div className='relative p-4 w-full max-w-2xl h-auto'>
          <div className='relative bg-white rounded-lg shadow '>
            <div className='flex justify-between items-start p-4 rounded-t border-b '>
              <h3 className='text-xl font-semibold text-gray-900 '>Web3Mail information</h3>
              {/* close button */}
              <button
                onClick={() => {
                  setShow(false);
                  setShowMailModal(false);
                }}
                type='button'
                className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center '
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
                <span className='sr-only'>Close modal</span>
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}>
              {({ isSubmitting }) => (
                <Form className='p-6 space-y-6'>
                  <div className='flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6'>
                    <div className='flex flex-row'>
                      <h3 className='font-semibold text-gray-900'>Mail privacy </h3>
                    </div>
                    <p>Here we will explain how the mail protector and grant access is working</p>
                    <Field
                      type='email'
                      name='email'
                      placeholder='Enter your email'
                      className='...'
                    />
                    <ErrorMessage name='email' component='div' className='error-message' />
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='block text-blue-600 bg-blue-50 hover:bg-green-500 hover:text-white rounded-lg px-5 py-2.5 text-center'>
                      Protect my mail
                    </button>
                    <div className='mt-4'>
                      <label>
                        <Toggle />
                        <span className='ml-2'>I allow the platform to send me notifications</span>
                      </label>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 '></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Web3Mail;

import React, { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import TurndownService from 'turndown';

// Dynamically import the TextEditor component
const DynamicTextEditor = dynamic(() => import('./TextEditor').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

const schema = Yup.object().shape({
  about: Yup.string().min(3).max(2000).required('Required'),
});

const turndownService = new TurndownService();

const RichText = () => {
  const formikProps = useFormikContext();
  const formik = useFormik({
    initialValues: { about: '<p>Testing</p>' },
    onSubmit: values => {
      console.log('Logging in ', values);
    },
    validationSchema: schema,
  });

  const handleValueChange = (val: string) => {
    const markdown = turndownService.turndown(val);
    formikProps.setFieldValue('about', markdown);
  };

  return (
    <div>
      <DynamicTextEditor setFieldValue={handleValueChange} value={formik.values.about} />
    </div>
  );
};

export default RichText;

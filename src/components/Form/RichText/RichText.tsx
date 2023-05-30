import React, { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';

// Dynamically import the TextEditor component
const DynamicTextEditor = dynamic(() => import('./TextEditor').then(mod => mod.default), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

console.log('DynamicTextEditor == ', DynamicTextEditor);

const schema = Yup.object().shape({
  about: Yup.string().min(3).max(2000).required('Required'),
});

const RichText = () => {
  const formikProps = useFormikContext();
  const formik = useFormik({
    initialValues: { about: '<p>Testing</p>' },
    onSubmit: values => {
      console.log('Logging in ', values);
    },
    validationSchema: schema,
  });

  return (
    <div>
      <DynamicTextEditor
        // TODO passer turndown de val
        setFieldValue={val => formikProps.setFieldValue('about', val)}
        value={formik.values.about}
      />
    </div>
  );
};

export default RichText;

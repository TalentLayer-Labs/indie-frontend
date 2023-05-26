import React, { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dynamic from 'next/dynamic';

// Dynamically import the TextEditor component
const DynamicTextEditor = dynamic(() => import('./TextEditor').then(mod => mod.default), {
  ssr: false,
});

const schema = Yup.object().shape({
  about: Yup.string().min(3).max(2000).required('Required'),
});

const RichText = () => {
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
        setFieldValue={val => formik.setFieldValue('about', val)}
        value={formik.values.about}
      />

      <p>formik values == {JSON.stringify(formik.values)}</p>
    </div>
  );
};

export default RichText;

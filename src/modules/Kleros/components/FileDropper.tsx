import React, { useRef } from 'react';
import { useFormikContext } from 'formik';

const FileDropper = ({
  fileSelected,
  setFileSelected,
}: {
  fileSelected: File | undefined;
  setFileSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
  const formikProps = useFormikContext();
  const fileInputRef = useRef<any>();

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = [...event.dataTransfer.files][0];
    formikProps.setFieldValue('file', file);

    setFileSelected(file);
    // setFileSelected(event.dataTransfer?.files[0]);
    // fileInputRef.current.files = event.dataTransfer?.files;
    // callback(event.dataTransfer?.files[0]);
  };

  return !fileSelected ? (
    <>
      <span className='text-gray-700'>Drop your file here</span>
      <div
        className={`h-40 p-50 mt-1 flex items-center justify-center flex-col text-24 text-gray-600 border-2 border-dashed border-gray-300 rounded-lg`}
        // onClick={() => fileInputRef?.current.click()}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => handleDragLeave(e)}
        ref={fileInputRef}>
        {/*{fileSelected ? fileSelected.name : <StyledUploadIcon />}*/}
        Drop stuff here
      </div>
    </>
  ) : (
    <>
      <span className='text-gray-700'>Your file</span>
      <div className={`mt-1 flex flex-col text-24 text-gray-600`}>{fileSelected.name}</div>
    </>
  );
  // <FileInput
  //   ref={fileInputRef}
  //   type="file"
  //   onChange={(event) => {
  //     //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     setFileSelected(event.target.files![0]);
  //     //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     callback(event.target.files![0]);
  //   }}
  //   {...props}
  // />
};

export default FileDropper;

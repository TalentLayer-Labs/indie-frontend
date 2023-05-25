import React, { useRef } from 'react';
import { useFormikContext } from 'formik';

const FileDropper = ({
  fileSelected,
  setFileSelected,
}: {
  fileSelected: File | undefined;
  setFileSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
  //TODO clean up this component
  //TODO no reset on error
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

  const removeFile = () => {
    setFileSelected(undefined);
    formikProps.setFieldValue('file', null);
  };

  return !fileSelected ? (
    <>
      <span className='text-gray-700 '>Evidence</span>
      <div
        className={`h-full max-h-fit p-50 mt-1 mb-1 flex items-center justify-center text-24 text-gray-600 border-2 border-dashed border-gray-300 rounded-lg`}
        // onClick={() => fileInputRef?.current.click()}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e)}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => handleDragLeave(e)}
        ref={fileInputRef}>
        {/*{fileSelected ? fileSelected.name : <StyledUploadIcon />}*/}
        Drop your file here
      </div>
    </>
  ) : (
    <>
      <span className='text-gray-700'>Your file</span>
      <div className={'flex-col'}>
        <div className='flex flex-row items-center justify-center place-content-end'>
          <div className={`mt-1 flex flex-col text-24 text-gray-600 items-center`}>
            {fileSelected.name}
          </div>
          <button
            onClick={() => removeFile()}
            type='button'
            className='ml-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center '
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
          </button>
        </div>
      </div>
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

import React, { useState, useRef, useEffect } from 'react';

const FileUploader = ({
  setFileSelected,
}: {
  setFileSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
}) => {
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
    fileInputRef.current.files = event.dataTransfer?.files;
    setFileSelected(event.dataTransfer?.files[0]);
    // callback(event.dataTransfer?.files[0]);
  };

  return (
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
  );
};

export default FileUploader;

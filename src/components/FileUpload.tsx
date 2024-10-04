'use client';

import { FilePlus2 } from 'lucide-react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          'flex flex-col items-center w-full h-72 p-12 justify-center border-2 border-dashed border-primary rounded-lg cursor-pointer bg-white bg-opacity-10 hover:bg-opacity-30 transition-all',
      })}
    >
      <input {...getInputProps()} />
      <FilePlus2 className='h-12 w-12 mb-5' />
      {isDragActive ? (
        <p className='text-center w-44'>Drop the file here ...</p>
      ) : (
        <p className='text-center w-44'>
          {'Drag & drop PDF here, or click to select files'}
        </p>
      )}
    </div>
  );
}

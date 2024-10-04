'use client';

import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { FilePlus2, Loader } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';
import { FileObject } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function FileUpload() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ fileKey, fileName }: FileObject) => {
      const response = await axios.post('/api/create-chat', {
        fileKey,
        fileName,
      });
      const { data } = response.data;
      return data;
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (!acceptedFiles) {
        toast.error('Invalid file selected');
        return;
      }
      try {
        const file = acceptedFiles[0];

        if (!file) {
          toast.error('Invalid file selected');
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error('File is too big. Maximum of 10MB is allowed.');
          return;
        }

        const fileData = await uploadToS3(file);

        if (!fileData) {
          toast.error('Failed to upload file');
          return;
        }

        mutate(fileData, {
          onSuccess: ({ chatId }) => {
            toast.success('File uploaded successfully');
            router.push(`/chat/${chatId}`);
          },
          onError: () => {
            toast.error('Failed to upload file');
          },
        });
      } catch (_) {
        toast.error('Failed to upload file');
      }
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
      {isPending ? (
        <Loader className='h-12 w-12 mb-5 animate-spin' />
      ) : (
        <FilePlus2 className='h-12 w-12 mb-5' />
      )}
      {isDragActive ? (
        <p className='text-center w-44'>Drop the file here ...</p>
      ) : (
        <p className='text-center w-44'>
          Drag & drop PDF here, or click to select a file
        </p>
      )}
    </div>
  );
}

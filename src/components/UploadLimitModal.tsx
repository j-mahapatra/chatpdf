'use client';

import React from 'react';
import axios from 'axios';
import { CircleAlert, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUploadLimitModal } from '@/components/UploadLimitModalProvider';
import { Button } from '@/components/ui/button';

export default function UploadLimitModal() {
  const { user } = useUser();
  const { isModalOpen, openModal, closeModal } = useUploadLimitModal();
  const { isLoading, refetch } = useQuery({
    queryKey: ['payments', user?.id],

    queryFn: async () => {
      const res = await axios.get('/api/payments');
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error('Something went wrong!');
      }
      return res.data;
    },
    enabled: false,
    retryOnMount: false,
    refetchOnMount: false,
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={isModalOpen ? () => closeModal() : () => openModal()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className='flex items-center'>
              <CircleAlert className='w-6 h-6 mr-2' />
              Upload Limit Reached
            </div>
          </DialogTitle>
          <DialogDescription>
            You have reached the upload limit. Please upgrade to{' '}
            <strong>PLUS</strong> subscription to continue using all the
            features.
          </DialogDescription>
        </DialogHeader>
        <div className='flex w-full space-x-2 justify-end'>
          <Button
            disabled={isLoading}
            variant={'outline'}
            onClick={() => closeModal()}
          >
            Later
          </Button>
          <Button disabled={isLoading} onClick={() => refetch()}>
            {isLoading && <Loader className='w-6 h-6 animate-spin' />}
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

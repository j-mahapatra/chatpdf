'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader, Rocket, Settings2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';

type ManageSubscriptionProps = {
  isPlusUser: boolean;
};

export default function ManageSubscription({
  isPlusUser,
}: ManageSubscriptionProps) {
  const { user } = useUser();

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
    <Button
      onClick={() => refetch()}
      className='flex justify-center'
      disabled={isLoading}
    >
      {isLoading && <Loader className='w-6 h-6 mr-2 animate-spin' />}
      {isLoading ? null : isPlusUser ? (
        <Settings2 className='w-6 h-6 mr-2' />
      ) : (
        <Rocket className='w-6 h-6 mr-2' />
      )}
      {isLoading
        ? null
        : isPlusUser
          ? 'Manage Subscription'
          : 'Upgrade to PLUS'}
    </Button>
  );
}

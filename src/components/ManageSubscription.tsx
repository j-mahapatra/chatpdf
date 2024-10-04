'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader, Rocket, Settings2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type ManageSubscriptionProps = {
  className?: string;
};

export default function ManageSubscription({
  className,
}: ManageSubscriptionProps) {
  const { user } = useUser();

  const { data: isPlusUser, isLoading: isSubscriptionCheckLoading } = useQuery({
    queryKey: ['plus', user?.id],

    queryFn: async () => {
      const res = await axios.get('/api/subscription');
      return res.data.isPlusUser;
    },
    refetchOnMount: true,
  });

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
      className={cn('flex justify-center items-center', className)}
      disabled={isLoading}
    >
      {(isLoading || isSubscriptionCheckLoading) && (
        <Loader className='w-6 h-6 animate-spin' />
      )}
      {isLoading || isSubscriptionCheckLoading ? null : isPlusUser ? (
        <Settings2 className='w-6 h-6 mr-2' />
      ) : (
        <Rocket className='w-6 h-6 mr-2' />
      )}
      {isLoading || isSubscriptionCheckLoading
        ? null
        : isPlusUser
          ? 'Manage Subscription'
          : 'Upgrade to PLUS'}
    </Button>
  );
}

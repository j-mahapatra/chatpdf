'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader, Rocket, Settings2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';

type ManageSubscriptionProps = {
  className?: string;
};

export default function ManageSubscription({
  className,
}: ManageSubscriptionProps) {
  const { user } = useUser();
  const [isCardVisible, setIsCardVisible] = useState<boolean>(false);

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

  const plans = useMemo(() => {
    return [
      {
        name: 'Free',
        price: '₹0',
        features: ['3 PDFs', 'Basic features', 'Limited support'],
        cta: "I'm good",
        ctaClick: () => setIsCardVisible(false),
      },
      {
        name: 'Plus',
        price: '₹500',
        features: ['Unlimited PDFs', 'Extended features', 'Dedicated support'],
        cta: 'Upgrade',
        ctaClick: () => refetch(),
      },
    ];
  }, [refetch]);

  return (
    <>
      <Button
        onClick={() => {
          if (isPlusUser) {
            refetch();
          } else {
            setIsCardVisible(true);
          }
        }}
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
      <Dialog
        open={isCardVisible && !isPlusUser}
        onOpenChange={() => setIsCardVisible((prev) => !prev)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className='grid gap-6 grid-cols-2 p-6'>
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className='flex flex-col justify-between items-start rounded-2xl shadow-md'
                  >
                    <CardHeader>
                      <CardTitle className='text-xl'>{plan.name}</CardTitle>
                      <p className='text-3xl font-bold'>{plan.price}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className='flex flex-col items-start mb-6 space-y-2'>
                        {plan.features.map((feature) => (
                          <li key={feature} className='text-muted-foreground'>
                            • {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className='w-full' onClick={plan.ctaClick}>
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

'use client';

import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { Progress } from '@/components/ui/progress';

type UserUploadCountProps = {
  uploadCount: number;
};

const MAX_UPLOADS_FOR_FREE_USER: number = parseInt(
  process.env.NEXT_PUBLIC_MAX_ALLOWED_UPLOADS!,
);

export default function UserUploadCount({ uploadCount }: UserUploadCountProps) {
  const { user } = useUser();

  const { data: isPlusUser } = useQuery({
    queryKey: ['plus', user?.id],

    queryFn: async () => {
      const res = await axios.get('/api/subscription');
      return res.data.isPlusUser;
    },
    refetchOnMount: true,
  });

  return (
    !isPlusUser && (
      <div className='flex flex-col w-full items-center py-5 space-y-2'>
        <Progress
          value={(uploadCount / MAX_UPLOADS_FOR_FREE_USER) * 100}
          className='w-[80%]'
        />
        <span>
          {uploadCount} out of {MAX_UPLOADS_FOR_FREE_USER} documents used
        </span>
      </div>
    )
  );
}

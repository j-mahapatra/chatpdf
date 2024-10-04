'use client';

import { Chat } from '@/lib/types';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { Loader, MessageSquareMore, Rocket, SquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

type ChatSidebarProps = {
  chats: Chat[];
  chatId: Chat['id'];
};

export default function ChatSidebar({ chats, chatId }: ChatSidebarProps) {
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
    <div className='relative w-full h-screen p-4 text-slate-200 bg-slate-900'>
      <Link href='/'>
        <Button className='w-full bg-indigo-700 hover:bg-indigo-800'>
          <SquarePlus className='w-6 h-6 mr-2' />
          Create New Chat
        </Button>
      </Link>
      <div className='flex flex-col space-y-2 mt-5'>
        {chats.map((chat) => {
          return (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  'flex space-x-2 items-center rounded-sm p-2',
                  chat.id === chatId && 'bg-slate-200 text-black',
                )}
              >
                <MessageSquareMore />
                <p className='text-left overflow-hidden truncate text-sm'>
                  {chat.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className='absolute -ml-4 flex flex-col justify-center bottom-4 w-full text-center'>
        <Button
          className='text-white bg-slate-600 hover:bg-slate-500 mb-2'
          disabled={isLoading}
          onClick={() => refetch()}
        >
          {isLoading ? (
            <Loader className='w-6 h-6 mr-2 animate-spin' />
          ) : (
            <Rocket className='w-6 h-6 mr-2' />
          )}
          Upgrade to PLUS
        </Button>
        <Link href='/' className='text-xs'>
          Powered by <strong>ChatPDF</strong>
        </Link>
      </div>
    </div>
  );
}

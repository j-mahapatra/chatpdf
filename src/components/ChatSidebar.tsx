import { Chat } from '@/lib/types';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';
import { MessageSquareMore, SquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChatSidebarProps = {
  chats: Chat[];
  chatId: Chat['id'];
};

export default function ChatSidebar({ chats, chatId }: ChatSidebarProps) {
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
      <div className='absolute -ml-4 flex justify-center bottom-4 w-full text-center'>
        <Link href='/' className='text-sm'>
          Powered by ChatPDF
        </Link>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import { Loader } from 'lucide-react';
import React from 'react';

type MessageListProps = {
  messages: Message[];
  isLoading: boolean;
};

export default function MessageList({ messages, isLoading }: MessageListProps) {
  if (!messages) {
    return null;
  }

  return isLoading ? (
    <div className='flex h-full justify-center items-center px-2'>
      <Loader className='w-12 h-12 animate-spin' />
    </div>
  ) : (
    <div className='flex flex-col justify-center items-center space-y-2 px-2'>
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn(
              'flex items-center rounded-sm p-2 max-w-fit shadow-md',
              message.role === 'user'
                ? 'bg-indigo-700 text-slate-100 self-end'
                : 'self-start',
            )}
          >
            <p className='text-left overflow-hidden break-words text-sm w-fit'>
              {message.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Message } from 'ai/react';
import React from 'react';

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  if (!messages) {
    return null;
  }

  return (
    <div className='flex flex-col space-y-2 px-2'>
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={cn(
              'flex space-x-2 items-center rounded-sm p-2',
              message.role === 'user' && 'bg-slate-600 text-black',
            )}
          >
            <p className='text-left overflow-hidden truncate text-sm'>
              {message.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

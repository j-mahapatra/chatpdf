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
              'flex items-center rounded-sm p-2 max-w-fit',
              message.role === 'user' && 'bg-slate-600 text-black self-end',
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

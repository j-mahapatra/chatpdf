import { cn } from '@/lib/utils';
import React from 'react';

const ChatLoader = () => {
  return (
    <div className='flex w-full pt-4 justify-start'>
      <div className='flex w-fit space-x-2 p-2'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 0.2}s` }}
            className={cn(
              'flex h-3 w-3 bg-primary/50 rounded-full items-center animate-fade-bounce',
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatLoader;

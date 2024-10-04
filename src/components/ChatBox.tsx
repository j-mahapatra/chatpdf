'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { Input } from '@/components/ui/input';
import MessageList from './MessageList';
import { Send } from 'lucide-react';
import { Button } from './ui/button';

export default function ChatBox({ chatId }: { chatId: number }) {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      api: '/api/chat',
      body: {
        chatId,
      },
    });

  return (
    <div className='flex flex-col h-screen max-h-screen p-1'>
      <div className='sticky top-0 inset-x-0 bg-white z-10'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>

      <div className='flex-1 overflow-y-auto p-2 flex flex-col-reverse'>
        <MessageList messages={messages} />
      </div>

      <form
        onSubmit={handleSubmit}
        className='sticky bottom-0 inset-x-0 py-4 bg-white z-10 flex space-x-1'
      >
        <Input
          value={input}
          placeholder='Ask a question...'
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button className='bg-indigo-700 hover:bg-indigo-800'>
          <Send className='h-6 w-6' />
        </Button>
      </form>
    </div>
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { chats } from '@/lib/schema';
import ChatSidebar from '@/components/ChatSidebar';

type ChatPageProps = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: ChatPageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  const chatList = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId));

  if (!chatList || !chatList.some((chat) => chat.id === parseInt(chatId))) {
    return redirect('/');
  }

  return (
    <div className='flex max-h-screen overflow-auto'>
      <div className='flex w-full max-h-screen overflow-auto'>
        <div className='flex-[1] max-w-xs'>
          <ChatSidebar chats={chatList} chatId={parseInt(chatId)} />
        </div>
        <div className='max-h-screen p-5 overflow-auto flex-[5]'>
          PDF Viewer
        </div>
        <div className='flex-[3] border-l-4 border-l-slate-500'>
          Chat Component
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { chats } from '@/db/schema';
import ChatSidebar from '@/components/ChatSidebar';
import PDFViewer from '@/components/PDFViewer';
import ChatBox from '@/components/ChatBox';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

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

  const currentChat = chatList.find((chat) => chat.id === parseInt(chatId));

  if (!chatList || !currentChat) {
    return redirect('/');
  }

  const input = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: currentChat.s3Key,
  };
  const command = new GetObjectCommand(input);

  const presignedUrl = await getSignedUrl(client as any, command as any, {
    expiresIn: 3600,
  });

  return (
    <div className='flex max-h-screen overflow-auto'>
      <div className='flex w-full max-h-screen overflow-auto'>
        <div className='flex-[1] max-w-xs'>
          <ChatSidebar chats={chatList} chatId={parseInt(chatId)} />
        </div>
        <div className='max-h-screen p-5 overflow-auto flex-[5]'>
          <PDFViewer url={presignedUrl} />
        </div>
        <div className='flex-[3] border-l-4 border-l-slate-500'>
          <ChatBox chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
}

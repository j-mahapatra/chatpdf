import FileUpload from '@/components/FileUpload';
import ManageSubscription from '@/components/ManageSubscription';
import { Button } from '@/components/ui/button';
import UploadLimitModal from '@/components/UploadLimitModal';
import { db } from '@/lib/db';
import { chats } from '@/lib/schema';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { FileText, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const user = await currentUser();

  let firstChat;

  if (user) {
    const chatsList = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, user.id));
    if (chatsList && chatsList.length > 0) {
      firstChat = chatsList[0];
    }
  }

  return (
    <div className='w-screen min-h-screen bg-gradient-to-r from-indigo-300 to-purple-400'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center'>
            {user?.firstName && (
              <div className='flex space-x-2 mb-5'>
                <p className='text-3xl'>Hi, {user.firstName} &#128075;</p>
                <UserButton />
              </div>
            )}
            <h1 className='text-7xl font-bold'>ChatPDF</h1>
            <p className='text-lg text-center'>
              Talk to <strong>PDFs</strong> with the power of{' '}
              <strong>AI</strong>
            </p>
          </div>
          <div className='flex flex-col items-center space-y-5 mt-5'>
            {user && <FileUpload />}
            {user && <UploadLimitModal />}
            {user ? (
              <>
                {user && firstChat && (
                  <Link href={`/chat/${firstChat.id}`}>
                    <Button className='w-fit'>
                      <FileText className='h-6 w-6 mr-2' />
                      Go to your PDFs
                    </Button>
                  </Link>
                )}
                <ManageSubscription />
              </>
            ) : (
              <Link href={`/sign-in`}>
                <Button className='w-fit'>
                  <LogIn className='h-6 w-6 mr-2' /> Get Started
                </Button>
              </Link>
            )}
          </div>
          {!user && (
            <div className='m-4 p-1 border border-slate-50 rounded-md'>
              <Image
                src='/landing-image.png'
                alt='app-demo'
                width={600}
                height={600}
                className='rounded-md shadow-lg'
              />
            </div>
          )}
          <p className='text-md text-center mt-5'>
            Upload a PDF, ask any question. No more searching through pages of
            text to find the information you need. No more tedious copying and
            pasting. Just ask <strong>ChatPDF</strong> and get the answers you
            need in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}

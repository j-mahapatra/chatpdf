import { NextRequest, NextResponse } from 'next/server';
import { FileObject } from '@/lib/types';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { db } from '@/lib/db';
import { chats } from '@/lib/schema';
import { getS3Url } from '@/lib/s3';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  const user = await auth();

  if (!user.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { fileKey, fileName }: FileObject = await request.json();

    if (!fileKey || !fileName) {
      return NextResponse.json({ message: 'Invalid Payload' }, { status: 400 });
    }

    await loadS3IntoPinecone(fileKey);

    const chatId = await db
      .insert(chats)
      .values({
        s3Key: fileKey,
        name: fileName,
        url: getS3Url(fileKey),
        userId: user.userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      {
        message: 'Message created successfully',
        data: { chatId: chatId[0].insertedId },
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(`Error - POST /create-chat: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

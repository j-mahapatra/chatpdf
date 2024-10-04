import { db } from '@/lib/db';
import { messages } from '@/lib/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ message: 'Invalid Payload' }, { status: 400 });
    }

    const parsedChatId = parseInt(chatId);

    const messageList = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, parsedChatId));

    return NextResponse.json(messageList, { status: 200 });
  } catch (error) {
    console.log(`Error - GET /messages: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

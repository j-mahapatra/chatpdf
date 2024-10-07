import { db } from '@/lib/db';
import { chats } from '@/lib/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await request.json();

    const chatList = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    return NextResponse.json(chatList, { status: 200 });
  } catch (error) {
    console.log(`Error - POST /chat: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

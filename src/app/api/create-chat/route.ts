import { NextRequest, NextResponse } from 'next/server';
import { FileObject } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { fileKey, fileName }: FileObject = await request.json();

    if (!fileKey || !fileName) {
      return NextResponse.json({ message: 'Invalid Payload' }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Message created successfully' },
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

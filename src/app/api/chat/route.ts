import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { OpenAIApi, Configuration } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(request: NextRequest) {
  try {
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { messages } = await request.json();

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      stream: true,
    });

    const stream = OpenAIStream(completion);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(`Error - POST /chat: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

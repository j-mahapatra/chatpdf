import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { OpenAIApi, Configuration } from 'openai-edge';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { getContext } from '@/lib/context';
import { chats, messages as messageSchema } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';

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

    const { messages, chatId } = await request.json();

    const chatList = await db.select().from(chats).where(eq(chats.id, chatId));

    if (chatList.length !== 1) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    const lastMessage = messages[messages.length - 1];
    const fileKey = chatList[0].s3Key;

    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: 'system',
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
    };

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === 'user'),
      ],
      stream: true,
    });

    const stream = OpenAIStream(completion, {
      onStart: async () => {
        await db.insert(messageSchema).values({
          chatId,
          content: lastMessage.content,
          role: 'user',
        });
      },
      onCompletion: async (completion) => {
        await db.insert(messageSchema).values({
          chatId,
          content: completion,
          role: 'system',
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(`Error - POST /chat: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

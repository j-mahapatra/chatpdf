import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try {
    const user = await auth();

    if (!user.userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const fileKey = searchParams.get('key');

    if (!fileKey) {
      return NextResponse.json({ message: 'Invalid Payload' }, { status: 400 });
    }

    const input = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: fileKey,
    };
    const command = new GetObjectCommand(input);

    const presignedUrl = await getSignedUrl(client as any, command as any, {
      expiresIn: 3600,
    });

    return NextResponse.json({ url: presignedUrl }, { status: 200 });
  } catch (error) {
    console.log(`Error - GET /document: ${error}`);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

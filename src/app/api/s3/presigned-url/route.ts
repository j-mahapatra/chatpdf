import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { fileNameToUrl } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    const fileName = searchParams.get('fileName') || uuidv4();

    const fileKey = `uploads/${user.id}/${Date.now().toString()}-${fileNameToUrl(fileName)}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: fileKey,
      ContentType: 'application/pdf',
    });

    const uploadURL = await getSignedUrl(client as any, command as any, {
      expiresIn: 60,
    });

    return Response.json({ uploadURL, fileName });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate pre-signed URL' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}

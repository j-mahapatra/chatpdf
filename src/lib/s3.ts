import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import fs from 'fs';

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  const fileKey =
    'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: file,
  });

  const response = await client.send(command);

  if (response.$metadata.httpStatusCode !== 200) {
    throw new Error('Failed to upload file');
  }

  return {
    fileKey: fileKey,
    fileName: file.name,
  };
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

export async function downloadFromS3(fileKey: string) {
  const input = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
    Key: fileKey,
  };
  const command = new GetObjectCommand(input);
  const response = await client.send(command);
  const saveDir = `/tmp/pdf-${Date.now()}.pdf`;
  const fileBuffer = await streamToBuffer(response.Body);
  fs.writeFileSync(saveDir, fileBuffer);
  return saveDir;
}

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
  return url;
}

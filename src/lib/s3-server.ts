import fs from 'fs';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

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

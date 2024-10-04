import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function uploadToS3(file: File) {
  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

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

export function getS3Url(fileKey: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileKey}`;
  return url;
}

import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from '@pinecone-database/pinecone';
import { FileObject, PDFDocument } from './types';
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { getEmbedding } from './embedding';
import md5 from 'md5';
import { Document } from '@langchain/core/documents';
import { convertToASCII, truncateStringByBytes } from './utils';

let pineconeClient: Pinecone | null = null;

export async function getPineconeClient(): Promise<Pinecone> {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  }
  return pineconeClient;
}

export function chunkVectors<T>(array: T[], chunkSize: number = 100): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function embedDocument(
  doc: Document,
): Promise<PineconeRecord<RecordMetadata>> {
  const embedding = await getEmbedding(doc.pageContent);
  const hash = md5(doc.pageContent);

  return {
    id: hash,
    values: embedding,
    metadata: {
      text: doc.metadata.text,
      pageNumber: doc.metadata.pageNumber,
    },
  } as PineconeRecord<RecordMetadata>;
}

export async function splitDocument(document: PDFDocument) {
  const { pageContent, metadata } = document;
  const modifiedPageContent = pageContent.replace(/\n/g, '');

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splitDocs = await textSplitter.splitDocuments([
    {
      pageContent: modifiedPageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        source: metadata.source,
        text: truncateStringByBytes(pageContent, 36000),
      },
    },
  ]);

  return splitDocs;
}

export async function loadS3IntoPinecone(fileKey: FileObject['fileKey']) {
  const saveDir = await downloadFromS3(fileKey);

  if (!saveDir) {
    throw new Error('Failed to download file');
  }

  const loader = new PDFLoader(saveDir);
  const docs = (await loader.load()) as PDFDocument[];

  const splitDocs = await Promise.all(docs.map(splitDocument));
  const vectors = await Promise.all(splitDocs.flat().map(embedDocument));

  const client = await getPineconeClient();
  const pineconeIndex = client.index(process.env.PINECONE_INDEX_NAME!);
  const modifiedFileKey = convertToASCII(fileKey);

  const namespace = pineconeIndex.namespace(modifiedFileKey);
  const vectorChunks = chunkVectors(vectors, 100);

  for (const chunk of vectorChunks) {
    await namespace.upsert(chunk);
  }

  return splitDocs[0];
}

import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbedding } from './embedding';
import { convertToASCII } from './utils';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string,
) {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const pineconeIndex = await client.index(process.env.PINECONE_INDEX_NAME!);

  const modifiedFileKey = convertToASCII(fileKey);
  const namespace = pineconeIndex.namespace(modifiedFileKey);

  const queryResult = await namespace.query({
    vector: embeddings,
    topK: 10,
    includeValues: true,
    includeMetadata: true,
  });

  return queryResult.matches || [];
}
export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbedding(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  const docs = matches.filter((match) => match.score && match.score > 0.7);

  const filteredDocs = docs.map(
    (doc) => (doc.metadata as { text: string; pageNumber: number }).text,
  );

  return filteredDocs.join('\n').slice(0, 3000);
}

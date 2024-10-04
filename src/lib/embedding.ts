import { OpenAIApi, Configuration } from 'openai-edge';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export async function getEmbedding(text: string) {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  });
  const res = await response.json();
  return res.data[0].embedding as number[];
}

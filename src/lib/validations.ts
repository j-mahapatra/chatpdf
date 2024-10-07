import axios from 'axios';

const MAX_UPLOADS_FOR_FREE_USER: number = parseInt(
  process.env.NEXT_PUBLIC_MAX_ALLOWED_UPLOADS!,
);

export async function checkUserUploadLimit(userId: string): Promise<boolean> {
  if (!userId) return false;

  const res = await axios.get('/api/subscription');

  if (res.data.isPlusUser) {
    return true;
  }

  const chatsResponse = await axios.post('/api/chat/details', {
    userId,
  });

  const chatList = chatsResponse.data;

  if (chatList.length >= MAX_UPLOADS_FOR_FREE_USER) {
    return false;
  }

  return true;
}

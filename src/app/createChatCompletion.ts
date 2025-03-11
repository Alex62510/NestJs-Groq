'use server';

import axios from 'axios';
import { ChatCompletionMessage } from '@/app/chat-completion-message.interface';

export default async function createChatCompletion(messages: ChatCompletionMessage[]) {
  try {
    const res = await axios.post(`${process.env.API_URL}/groq/chatCompletion`, {messages}, {
      headers: { 'Content-Type': 'application/json' },
    });

    return res.data;
  } catch (error) {
    console.error('Ошибка при запросе к API:', error);
    throw new Error('Ошибка при обращении к API');
  }
}

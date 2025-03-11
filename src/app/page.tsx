'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatCompletionMessage } from '@/app/chat-completion-message.interface';
import createChatCompletion from '@/app/createChatCompletion';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessage = async () => {
    if (message.trim() === '') {
      toast.warn('Введите сообщение!', { position: 'top-right' });
      return;
    }

    const updatedMessages = [
      ...messages,
      {
        role: 'user',
        content: message.trim(),
        name: "Alex",
      },
    ];

    setMessages(updatedMessages);
    setMessage('');

    try {
      const assistantMessage = await createChatCompletion(updatedMessages);
      if (!assistantMessage) {
        toast.error('Ошибка: пустой ответ от API', { position: 'top-right' });
        return;
      }

      setMessages([...updatedMessages, { role: 'assistant', content: assistantMessage, name: 'Assistant' }]);
    } catch (error) {
      toast.error('Ошибка запроса к API', { position: 'top-right' });
      console.error('Ошибка запроса:', error);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
      <div className="h-screen flex items-center justify-center flex-col gap-10 container w-full pl-4 pt-6 pr-4">
        <ToastContainer />
        <div className="flex flex-col gap-3 h-[75%] overflow-scroll overflow-x-hidden w-full">
          {messages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'chat chat-start' : 'chat chat-end'}>
                <div className="chat-bubble bg-white rounded-xl">
                  <p className={message.role === 'user' ? '' : 'bg-white'}>{message.content}</p>
                </div>
              </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="relative w-full p-2">
          <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Enter your Message"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await handleMessage();
                }
              }}
              className="input input-bordered w-full  px-6"
          />
          <PaperAirplaneIcon
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer"
              onClick={async () => await handleMessage()}
          />
        </div>
      </div>
  );
}

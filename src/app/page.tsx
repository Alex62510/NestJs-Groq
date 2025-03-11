'use client';

import {useEffect, useRef, useState} from 'react';
import { ChatCompletionMessage } from '@/app/chat-completion-message.interface';
import createChatCompletion from '@/app/createChatCompletion';

export default function Home() {
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleMessage = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: 'user',
        content: message,
        name: "Alex",
      },
    ];

    setMessages(updatedMessages);
    setMessage('');

    try {
      const assistantMessage = await createChatCompletion(updatedMessages);
      if (!assistantMessage) {
        console.error('Ошибка: пустой ответ от API');
        return;
      }

      setMessages([...updatedMessages, {role:'assistant', content:assistantMessage,name:'Assistant'}]);
    } catch (error) {
      console.error('Ошибка запроса:', error);
    }
  };
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
      <div
          className={'h-screen flex items-center justify-center flex-col gap-10 container mx-auto pl-4 pt-6 pr-4'}>
        <div className={'flex flex-col gap-3 h-[75%] overflow-scroll overflow-x-hidden w-full'}>
          {messages.map((message, index) => (
              <div key={index}
                   className={message.role === 'user' ? 'chat chat-start' : 'chat chat-end '}>
                <div className={'chat-bubble bg-white rounded-xl'}>
                  <p className={message.role === 'user' ? '' : 'bg-white'}>{message.content}</p>
                </div>
              </div>
          ))}
          <div ref={messagesEndRef}/>
        </div>
        <div className="flex items-center w-full gap-1">
          <input value={message} onChange={(e) => setMessage(e.target.value)} type="text"
                 placeholder={'Enter your Message'} onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await handleMessage();
            }
          }} className={'input input-bordered w-full m-10'}/>
          <button
              onClick={async () => await handleMessage()}
              className={'btn btn-primary'}
          >
            Отправить
          </button>
        </div>

      </div>
  );
}

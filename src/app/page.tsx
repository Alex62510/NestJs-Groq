'use client';

import {useEffect, useRef, useState} from 'react';
import {ChatCompletionMessage} from '@/app/chat-completion-message.interface';
import createChatCompletion from '@/app/createChatCompletion';
import {PaperAirplaneIcon} from "@heroicons/react/24/solid";
import {toast, ToastContainer} from 'react-toastify';
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
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role === 'assistant') {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(lastMessage.content);
      utterance.lang = 'ru-RU';
      synth.speak(utterance);
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // const startListening = () => {
  //   const SpeechRecognition =
  //       (window as unknown as { SpeechRecognition: typeof window.SpeechRecognition; webkitSpeechRecognition: typeof window.SpeechRecognition })
  //           .SpeechRecognition ||
  //       (window as unknown as { SpeechRecognition: typeof window.SpeechRecognition; webkitSpeechRecognition: typeof window.SpeechRecognition })
  //           .webkitSpeechRecognition;
  //   if (!SpeechRecognition) {
  //     toast.error('Ваш браузер не поддерживает голосовой ввод!', { position: 'top-right' });
  //     return;
  //   }
  //
  //   const recognition = new SpeechRecognition();
  //   recognition.lang = 'ru-RU';
  //   recognition.interimResults = false;
  //   recognition.maxAlternatives = 1;
  //
  //   recognition.onstart = () => {
  //     setIsListening(true);
  //   };
  //
  //   recognition.onresult = (event: SpeechRecognitionEvent) => {
  //
  //     const resultsArray = Array.from(event.results);
  //     if (resultsArray.length > 0) {
  //       const result = resultsArray[0];
  //
  //       if (Array.isArray(result) && result.length > 0) {
  //         const transcript = result[0].transcript;
  //         setMessage(transcript);
  //       }
  //     }
  //   };



    // recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    //   console.log('Ошибка распознавания:', event.error);
    //   toast.error('Ошибка голосового ввода!', { position: 'top-right' });
    // };
    //
    // recognition.onend = () => {
    //   setIsListening(false);
    // };
    //
    // recognition.start();
  // };

  return (
      <div className="h-screen flex items-center justify-center flex-col gap-10 w-full pl-4 pt-6 pr-4">
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

        <div className="relative w-full p-1  gap-4 flex items-center">
          <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Введите сообщение"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await handleMessage();
                }
              }}
              className="input input-bordered w-full px-6"
          />
          {/*<MicrophoneIcon*/}
          {/*    className={`w-6 h-6 mx-2 cursor-pointer ${isListening ? 'text-red-500' : 'text-gray-500 hover:text-blue-600'}`}*/}
          {/*    onClick={startListening}*/}
          {/*/>*/}
          <PaperAirplaneIcon
              className="w-6 h-6 text-gray-500 hover:text-blue-600 cursor-pointer"
              onClick={async () => await handleMessage()}
          />
        </div>
      </div>
  );
}


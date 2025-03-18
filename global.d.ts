declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    type SpeechRecognitionEvent = Event & {
        readonly results: SpeechRecognitionResultList;
    };

    type SpeechRecognitionErrorEvent = Event & {
        readonly error: string;
        readonly message: string;
    };

    type SpeechRecognitionResultList = {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
    };

    type SpeechRecognitionResult = {
        readonly isFinal: boolean;
        readonly transcript: string;
        readonly confidence: number;
    };

    class SpeechRecognition {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        start(): void;
        stop(): void;
        abort(): void;

        onstart: () => void;
        onresult: (event: SpeechRecognitionEvent) => void;
        onerror: (event: SpeechRecognitionErrorEvent) => void;
        onend: () => void;
    }
}

export {};

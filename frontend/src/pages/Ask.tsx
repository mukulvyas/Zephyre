import React, { useState } from 'react';
import { UserProfile, AskResponse } from '../types';
import { askCoach } from '../api/client';
import { ChatBubble, ChatMessage } from '../components/ChatBubble';
import { SkeletonCard } from '../components/SkeletonCard';
import { ErrorState } from '../components/ErrorState';
import { Send, Mic, MicOff, RotateCcw, Sparkles } from 'lucide-react';

interface AskProps {
  profile: UserProfile;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1-u',
    sender: 'user',
    text: 'Can Aarav (6 yrs old, son) go to outdoor football coaching at 4:30 PM today in Delhi?',
    timestamp: '4:02 PM',
  },
  {
    id: 'msg-1-a',
    sender: 'assistant',
    timestamp: '4:02 PM',
    response: {
      verdict: 'avoid',
      verdict_label: 'Avoid Outdoor Coaching',
      reason:
        'Delhi AQI at 4:30 PM is forecasted at 340 (Very Poor category). Vigorous outdoor exertion causes children like Aarav to breathe much more air per minute, pulling micro-particulates deep into growing lung tissue.',
      suggestion:
        '⚽ Move football indoors: footwork drills, soft foam ball juggling, or living room coordination obstacles!',
      impact: 'Keeps Aarav away from the worst air of the day.',
      safer_time: 'Tomorrow 2:00 PM – 4:00 PM',
      needs_doctor: false,
      language: 'en',
      is_offline_fallback: false,
    },
  },
  {
    id: 'msg-2-u',
    sender: 'user',
    text: 'Can Kavita (68 yrs old, mild asthma) take her usual evening walk in the society park?',
    timestamp: '4:05 PM',
  },
  {
    id: 'msg-2-a',
    sender: 'assistant',
    timestamp: '4:05 PM',
    response: {
      verdict: 'avoid',
      verdict_label: 'Stay Indoors This Evening',
      reason:
        'Evening air cools and traps smog at ground level (AQI 340 Very Poor). This triggers bronchial spasm and airway inflammation for seniors with mild asthma.',
      suggestion:
        '🚶‍♀️ 20-minute gentle corridor walking indoors, followed by light diaphragmatic breathing exercises.',
      impact: 'Keeps Kavita away from the worst evening air.',
      safer_time: 'Tomorrow 2:00 PM – 4:00 PM',
      needs_doctor: false,
      language: 'en',
      is_offline_fallback: false,
    },
  },
];

export const Ask: React.FC<AskProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Quick Questions
  const quickQuestions = [
    { label: 'Can my kid play outside?', prompt: 'Can Aarav play outside after school today?' },
    { label: 'Should I open the window?', prompt: 'Should I open the window for fresh air this morning?' },
    { label: 'Best mask for today?', prompt: 'What is the best mask for smog today for elderly parents?' },
    { label: 'Safe to walk at 6 PM?', prompt: 'Is it safe to walk at 6 PM in the society park today?' },
  ];

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputText).trim();
    if (!q || loading) return;

    setError(null);
    setInputText('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result: AskResponse = await askCoach(q, profile.language || 'en', profile);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        response: result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get answer. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API Voice Recognition (graceful if not supported)
  const handleVoiceInput = () => {
    // Check browser speech recognition support
    interface SpeechRecognitionInstance {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: () => void;
      onend: () => void;
      onerror: () => void;
      onresult: (event: { results: Array<Array<{ transcript: string }>> }) => void;
      start: () => void;
    }

    const windowAny = window as unknown as Record<string, unknown>;
    const SpeechRecognition =
      (windowAny.SpeechRecognition as { new (): SpeechRecognitionInstance } | undefined) ||
      (windowAny.webkitSpeechRecognition as { new (): SpeechRecognitionInstance } | undefined);

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = profile.language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: { results: Array<Array<{ transcript: string }>> }) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch (e) {
      console.warn('Voice recognition error:', e);
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto w-full pb-28 text-left">
      {/* Assistant Greeting Header Card */}
      <div className="w-full bg-surface-container-lowest rounded-24 p-5 shadow-xs border border-outline-variant/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-on-surface">Zephyre Breeze AI</h2>
              <span className="bg-primary-fixed text-on-primary-fixed text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-on-surface-variant truncate mt-0.5">
              Always here with gentle, science-backed guidance for your family
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages([])}
          className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:bg-surface-container hover:text-primary transition flex-shrink-0"
          title="Clear chat history"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Question Chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-on-surface-variant px-1 flex items-center gap-1">
          💡 Common family questions right now
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q.prompt)}
              className="flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container-high transition text-on-surface text-xs font-semibold shadow-xs border border-outline-variant/30 active:scale-95"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="flex flex-col gap-4 mt-2" aria-live="polite">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {loading && <SkeletonCard height="h-44" />}
        {error && <ErrorState message={error} onRetry={() => handleSend()} />}
      </div>

      {/* Fixed Sticky Chat Input Bar */}
      <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-30 p-3 max-w-2xl mx-auto pointer-events-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pointer-events-auto bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/30 rounded-full shadow-lg p-1.5 pl-4 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about outdoor sports, air purifiers, masks..."
            maxLength={300}
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none"
            aria-label="Ask a question about air quality"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 ${
              isListening ? 'bg-error text-white animate-pulse' : 'text-on-surface-variant hover:text-primary'
            }`}
            title="Speak with voice input"
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center transition hover:bg-primary-container disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

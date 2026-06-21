import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles } from 'lucide-react';
import { api, type ChatMessage, type Outfit } from '@/lib/api';
import { useStyleSync } from '@/context/StyleSyncContext';
import { useAuth } from '@/context/AuthContext';
import { useStyleSyncStore } from '@/store/useStyleSyncStore';
import { AIThinking } from '../components/AIThinking';

const QUICK_ACTIONS = [
  'Make more formal',
  'Make more casual',
  'Add layers',
  'Streetwear version',
  'Luxury version',
  'Minimal version',
  'Darker palette',
  'Korean fit',
  'Add pop of color',
];

export function AIStylist() {
  const { user } = useAuth();
  const { memory, lastOutfits, refreshHistory } = useStyleSync();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hey! What are you getting ready for today?`,
      timestamp: new Date().toISOString(),
    },
    {
      role: 'assistant',
      content: `Would you like to add a quick selfie for better color recommendations?`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [message, setMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastOutfit = lastOutfits[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setMessage('');
    setThinking(true);
    
    // Save as a refinement to conversational memory if it's a quick action or short enough
    if (QUICK_ACTIONS.includes(text) || text.length < 50) {
      useStyleSyncStore.getState().addConversationalRefinement(text);
    }

    try {
      const res = await api.chat.send(text, sessionId, lastOutfit);
      setSessionId(res.sessionId);
      setMessages((m) => [...m, ...res.messages]);
      refreshHistory();
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: "I'm having trouble connecting. Please ensure the API server is running.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const compareLastTwo = () => {
    if (lastOutfits.length >= 2) {
      sendMessage(`Compare "${lastOutfits[0].name}" vs "${lastOutfits[1].name}" — which works better for today?`);
    }
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-0px)]">
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          OUTFYT
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your AI stylist that talks to you before you step out.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {memory?.insights?.map((insight, i) => (
            <p key={i} className="text-xs text-gray-600 px-3 py-1.5 rounded-full bg-gray-100">
              ✨ {insight}
            </p>
          ))}
          {memory?.repeatWarning && (
            <p className="text-xs text-amber-700 px-3 py-1.5 rounded-full bg-amber-50">
              {memory.repeatWarning}
            </p>
          )}
        </div>
        {lastOutfits.length >= 2 && (
          <button onClick={compareLastTwo} className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
            Compare last 2 outfits
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-2xl ${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              )}
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#7C6CFF] to-[#9B8AFF] text-white rounded-tr-sm'
                    : 'bg-white border border-[#7C6CFF]/15 text-gray-800 rounded-tl-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>
                {msg.content === 'Would you like to add a quick selfie for better color recommendations?' && (
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => sendMessage("I'll take a selfie")} className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50">
                      Take Selfie
                    </button>
                    <button onClick={() => sendMessage("Skip")} className="px-4 py-2 bg-transparent text-gray-600 hover:text-gray-900 text-sm font-medium">
                      Skip
                    </button>
                  </div>
                )}
                {msg.outfits && msg.outfits.map((outfit, idx) => (
                  <OutfitPreview key={idx} outfit={outfit} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
        {thinking && <AIThinking label="Styling your response..." />}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 p-4 border-t border-[#7C6CFF]/10 bg-white/60 backdrop-blur-md">
        <div className="flex flex-wrap gap-2 mb-3 max-w-4xl mx-auto">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => sendMessage(action)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(message)}
            placeholder="Ask your stylist anything..."
            className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={() => sendMessage(message)}
            disabled={thinking}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] hover:opacity-90 text-white disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function OutfitPreview({ outfit }: { outfit: Outfit }) {
  return (
    <div className="mt-4 p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-4xl">{outfit.emoji}</span>
        <div>
          <p className="font-semibold text-gray-900 text-lg">{outfit.name}</p>
          <p className="text-sm font-medium text-blue-600">{outfit.confidence}% match</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {outfit.items?.map((item, i) => (
          <span key={i} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

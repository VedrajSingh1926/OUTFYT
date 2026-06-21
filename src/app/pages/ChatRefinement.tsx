import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, Image, Settings2 } from 'lucide-react';

export function ChatRefinement() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi Jane! I'm your AI styling assistant. I've analyzed your wardrobe and today's context. How can I help refine your outfit?",
      timestamp: '10:30 AM'
    },
    {
      role: 'user',
      content: 'Make my outfit more formal for the client meeting',
      timestamp: '10:31 AM'
    },
    {
      role: 'assistant',
      content: "Great choice! For a more formal look, I'd suggest swapping the black jeans for your gray dress pants. This elevates the outfit while maintaining the smart aesthetic. The navy blazer and white button-up remain perfect.",
      outfit: {
        name: 'Elevated Professional',
        confidence: 96,
        emoji: '💼'
      },
      timestamp: '10:31 AM'
    },
  ]);

  const quickActions = [
    'Make it more casual',
    'Show streetwear version',
    'Use darker colors',
    'Add a pop of color',
    'Switch to formal',
    'Weather-appropriate layers',
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        role: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I understand! Let me create a variation based on your request. Here's what I suggest...",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  return (
    <div className="h-full flex">
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#7C6CFF]/10 bg-white/50 backdrop-blur-sm">
          <h1
            className="text-3xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            AI Styling Assistant
          </h1>
          <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
            Refine your outfits with intelligent conversation
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-2xl ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
                      AI Stylist
                    </span>
                    <span className="text-xs text-foreground/40" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white ml-auto'
                      : 'bg-white/80 backdrop-blur-sm border border-white/50'
                  }`}
                >
                  <p className="leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {msg.content}
                  </p>

                  {msg.outfit && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{msg.outfit.emoji}</div>
                        <div>
                          <p className="font-medium" style={{ fontFamily: 'var(--font-caveat)' }}>
                            {msg.outfit.name}
                          </p>
                          <p className="text-xs opacity-70" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {msg.outfit.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <button
                        className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        View Full Outfit
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="text-xs text-foreground/40" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="px-6 py-4 border-t border-[#7C6CFF]/10 bg-white/50 backdrop-blur-sm">
          <p className="text-sm text-foreground/60 mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
            Quick refinements:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => setMessage(action)}
                className="px-4 py-2 rounded-full bg-white/80 border border-[#7C6CFF]/10 hover:border-[#7C6CFF]/30 hover:bg-white transition-all text-sm"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-[#7C6CFF]/10 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-2xl bg-white border border-[#7C6CFF]/10 hover:border-[#7C6CFF]/30 transition-all flex items-center justify-center">
              <Image className="w-5 h-5 text-foreground/60" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe how you'd like to adjust your outfit..."
                className="w-full px-6 py-3 rounded-2xl bg-white border border-[#7C6CFF]/10 focus:border-[#7C6CFF]/30 focus:outline-none focus:ring-2 focus:ring-[#7C6CFF]/20"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white hover:shadow-lg hover:shadow-[#7C6CFF]/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Styling context */}
      <div className="hidden lg:block w-80 border-l border-[#7C6CFF]/10 bg-white/50 backdrop-blur-sm p-6 space-y-6">
        <div>
          <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>
            Current Context
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/5 to-[#FF6B81]/5 border border-white/30">
              <p className="text-xs text-foreground/60 mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                Weather
              </p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
                68°F Cloudy
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/5 to-[#FF6B81]/5 border border-white/30">
              <p className="text-xs text-foreground/60 mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                Occasion
              </p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
                Client Meeting
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/5 to-[#FF6B81]/5 border border-white/30">
              <p className="text-xs text-foreground/60 mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                Mood
              </p>
              <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
                Confident
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>
            Recent Sessions
          </h3>

          <div className="space-y-3">
            {['Weekend Brunch', 'Friday Work', 'Evening Date'].map((session, i) => (
              <button
                key={i}
                className="w-full p-3 rounded-xl bg-white/80 border border-white/50 hover:border-[#7C6CFF]/30 transition-all text-left"
              >
                <p className="text-sm mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {session}
                </p>
                <p className="text-xs text-foreground/40" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {i === 0 ? 'Today' : i === 1 ? 'Yesterday' : '2 days ago'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full px-4 py-3 rounded-2xl border border-[#7C6CFF]/20 hover:border-[#7C6CFF]/40 transition-all flex items-center justify-center gap-2"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <Settings2 className="w-4 h-4" />
          Adjust Preferences
        </button>
      </div>
    </div>
  );
}

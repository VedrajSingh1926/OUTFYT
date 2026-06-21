import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Sparkles, Camera, MessageCircle, Clock, History, ChevronRight, Heart
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStyleSync } from '@/context/StyleSyncContext';

export function MainDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { memory, history, savedLooks } = useStyleSync();

  const firstName = user?.name?.split(' ')[0] || 'Stylist';
  const lastSession = history.find((h) => h.type === 'outfit_session');

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>
          Good morning, {firstName}.
        </h1>
        <p className="text-gray-500 text-lg" style={{ fontFamily: 'var(--font-inter)' }}>
          Ready to look your best today?
        </p>
      </header>

      {/* Hero Action: Live Mirror (Premium Gradient) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/app/mirror')}
        className="group relative p-8 md:p-10 rounded-[2rem] text-white overflow-hidden shadow-[0_20px_40px_-15px_rgba(124,108,255,0.4)] cursor-pointer hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_rgba(124,108,255,0.5)] transition-all duration-400 bg-gradient-to-br from-[#7C6CFF] via-[#9B8AFF] to-[#FF6B81]"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl opacity-50 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Experience
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 drop-shadow-md" style={{ fontFamily: 'var(--font-inter)' }}>
              Get Ready With<br />Live Mirror
            </h2>
            <p className="text-white/90 max-w-sm text-sm md:text-base leading-relaxed mb-8 drop-shadow-sm font-medium">
              Step in front of the camera and let your AI stylist analyze your fit in real-time. Ask questions naturally.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wide">
            <div className="w-12 h-12 rounded-full bg-white text-[#7C6CFF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Camera className="w-5 h-5" />
            </div>
            <span className="group-hover:translate-x-1 transition-transform drop-shadow-sm">Talk to Your Stylist</span>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Secondary Action: AI Stylist Chat */}
        <button
          onClick={() => navigate('/app/stylist')}
          className="p-6 md:p-8 rounded-[1.5rem] bg-white border border-[#7C6CFF]/15 shadow-sm hover:shadow-[0_10px_30px_-15px_rgba(124,108,255,0.3)] hover:border-[#7C6CFF]/30 transition-all text-left flex flex-col justify-between h-full group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF6B81]/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C6CFF]/10 to-[#FF6B81]/10 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-[#7C6CFF]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-inter)' }}>Start a New Look</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
              Not sure what to wear? Chat with your AI stylist to generate the perfect outfit combination.
            </p>
          </div>
          <div className="flex items-center text-[#7C6CFF] text-sm font-bold tracking-wide">
            Start Styling <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Recent Activity / Preferences */}
        <div className="space-y-5">
          {lastSession ? (
            <button
              onClick={() => navigate('/app/stylist')}
              className="w-full p-5 rounded-[1.5rem] bg-gradient-to-br from-[#FAFAFA] to-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#7C6CFF]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Continue Styling</p>
                  <p className="text-xs text-gray-500 font-medium">{new Date(lastSession.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#7C6CFF] group-hover:translate-x-1 transition-all" />
            </button>
          ) : (
            <div className="w-full p-5 rounded-[1.5rem] bg-gradient-to-br from-[#FAFAFA] to-white border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4 opacity-60">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">No Recent Sessions</p>
                  <p className="text-xs text-gray-400 font-medium">Your chat history will appear here.</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 rounded-[1.5rem] bg-[#FAFAFA] border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#7C6CFF]/5 to-transparent rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <Sparkles className="w-5 h-5 text-[#FF6B81]" />
              <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Preference Insights</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              {memory?.insights && memory.insights.length > 0 ? (
                memory.insights.slice(0, 3).map((insight, i) => (
                  <div key={i} className="text-sm font-medium text-gray-600 flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                    <span className="text-[#FF6B81] mt-0.5">•</span>
                    {insight}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 font-medium bg-white p-4 rounded-xl border border-gray-50 text-center">
                  Your style insights will appear here as you chat. Let's get to know you!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-5 pt-4">
         <div onClick={() => navigate('/app/history')} className="cursor-pointer group p-6 rounded-[1.5rem] bg-white border border-[#7C6CFF]/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
           <div>
             <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{history.length}</p>
             <p className="text-xs font-bold text-[#7C6CFF] uppercase tracking-widest">Total Sessions</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#7C6CFF]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <History className="w-5 h-5 text-[#7C6CFF]" />
           </div>
         </div>
         
         <div onClick={() => navigate('/app/saved')} className="cursor-pointer group p-6 rounded-[1.5rem] bg-white border border-[#FF6B81]/10 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
           <div>
             <p className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-inter)' }}>{savedLooks.length}</p>
             <p className="text-xs font-bold text-[#FF6B81] uppercase tracking-widest">Saved Looks</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-[#FF6B81]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Heart className="w-5 h-5 text-[#FF6B81]" />
           </div>
         </div>
      </div>
    </div>
  );
}

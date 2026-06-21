import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Mic, MicOff, X, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GeminiLiveClient } from '@/lib/geminiLiveClient';

export function LiveMirror() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [client, setClient] = useState<GeminiLiveClient | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const frameIntervalRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setStatus('error');
      return;
    }

    const systemInstruction = `
      You are OUTFYT, a premium AI fashion stylist speaking directly to the user through a Live Mirror.
      You can see them and hear them. Act as their personal stylist. 
      Keep your responses conversational, concise, and focused on fashion, fit, and styling.
      If they ask how they look, analyze their current outfit and give specific, actionable feedback.
    `;

    const liveClient = new GeminiLiveClient(apiKey, systemInstruction);
    setClient(liveClient);

    liveClient.setCallbacks(
      (msg) => {
        // Simple visualizer trigger: if we receive audio, show speaking animation
        if (msg.serverContent?.modelTurn) {
          setIsSpeaking(true);
          setTimeout(() => setIsSpeaking(false), 2000);
        }
      },
      (state) => {
        if (state === 'connected' && videoRef.current) {
          liveClient.startMedia(videoRef.current);
          startFrameExtraction(liveClient);
          // Send initial prompt to kickstart the conversation
          liveClient.sendClientContent("Hi OUTFYT, I'm here! What do you think of my look today?");
        }
        setStatus(state as any);
      }
    );

    liveClient.connect();

    return () => {
      liveClient.disconnect();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, []);

  const startFrameExtraction = (liveClient: GeminiLiveClient) => {
    frameIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && liveClient) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Compress significantly to avoid huge payloads
          const base64 = canvas.toDataURL('image/jpeg', 0.5);
          liveClient.sendVideoFrame(base64);
        }
      }
    }, 1000); // 1 FPS
  };

  const handleEndSession = () => {
    client?.disconnect();
    navigate('/app/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA] flex flex-col font-sans">
      {/* Hidden canvas for extracting frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-inter)' }}>Live Mirror</h1>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              {status === 'connecting' ? 'Connecting...' : status === 'connected' ? 'AI is watching & listening' : 'Disconnected'}
            </p>
          </div>
        </div>
        <button onClick={handleEndSession} className="p-3 rounded-full bg-white text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Video Feed */}
      <div className="flex-1 relative pt-24 px-6 pb-48 flex items-center justify-center">
        <div className="relative w-full max-w-lg aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(124,108,255,0.3)] border-4 border-white">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover mirror-mode"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Scanning Overlay Effect */}
          {status === 'connected' && (
            <motion.div 
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#7C6CFF]/20 to-transparent pointer-events-none"
            />
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-white via-white to-transparent flex flex-col items-center">
        
        {/* AI Speaking Indicator */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white shadow-lg"
            >
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">OUTFYT is speaking...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full shadow-md transition-all ${isMuted ? 'bg-[#FF6B81] text-white' : 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button 
            onClick={handleEndSession}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#9B8AFF] text-white font-bold tracking-wide hover:scale-105 transition-transform shadow-[0_10px_20px_-10px_rgba(124,108,255,0.5)]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

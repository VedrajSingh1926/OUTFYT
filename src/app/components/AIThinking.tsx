import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function AIThinking({ label = 'StyleSync is styling...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center shadow-lg shadow-[#7C6CFF]/30"
      >
        <Sparkles className="w-7 h-7 text-white" />
      </motion.div>
      <p className="text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
        {label}
      </p>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#7C6CFF]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

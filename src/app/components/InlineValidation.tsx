import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export function InlineValidation({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-[#FF6B81]/8 border border-[#FF6B81]/20 text-sm text-[#FF6B81]"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

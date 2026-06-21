import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  emoji = '✨',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-8 rounded-3xl bg-gradient-to-br from-white/90 to-[#F5F0FF]/80 border border-[#7C6CFF]/10"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#7C6CFF]/15 to-[#FF6B81]/15 flex items-center justify-center">
        {Icon ? <Icon className="w-10 h-10 text-[#7C6CFF]" /> : <span className="text-4xl">{emoji}</span>}
      </div>
      <h3 className="text-2xl mb-2 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
        {title}
      </h3>
      <p className="text-sm text-foreground/60 max-w-sm mx-auto mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-sm hover:shadow-lg transition-all inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <Sparkles className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

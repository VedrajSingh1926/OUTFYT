import { motion } from 'motion/react';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import type { Outfit } from '@/lib/api';

interface OutfitCardProps {
  outfit: Outfit;
  index?: number;
  saved?: boolean;
  onSave?: () => void;
  onSelect?: () => void;
  onRegenerate?: () => void;
}

export function OutfitCard({
  outfit,
  index = 0,
  saved,
  onSave,
  onSelect,
  onRegenerate,
}: OutfitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all overflow-hidden relative">
        <div className={`absolute inset-0 bg-gradient-to-br ${outfit.gradient || 'from-[#7C6CFF]/10 to-[#FF6B81]/10'} opacity-50`} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="text-5xl">{outfit.emoji || '✨'}</div>
            <div className="flex gap-2">
              {onRegenerate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate();
                  }}
                  className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <RefreshCw className="w-4 h-4 text-[#7C6CFF]" />
                </button>
              )}
              {onSave && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    saved ? 'bg-[#FF6B81] text-white' : 'bg-white/80 text-foreground/40 hover:text-[#FF6B81]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          </div>

          <h3 className="text-xl mb-1" style={{ fontFamily: 'var(--font-caveat)' }}>
            {outfit.name}
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#7C6CFF]" />
            <span className="text-sm text-[#7C6CFF]" style={{ fontFamily: 'var(--font-poppins)' }}>
              {outfit.confidence}% match
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {outfit.items?.slice(0, 4).map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-white/60 text-xs"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Weather', value: outfit.weatherMatch },
              { label: 'Mood', value: outfit.moodMatch },
              { label: 'Colors', value: outfit.colorHarmony },
            ].map((s) => (
              <div key={s.label} className="p-2 rounded-xl bg-white/50">
                <p className="text-xs text-foreground/50" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {s.label}
                </p>
                <p className="text-sm font-medium text-[#7C6CFF]" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {s.value}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

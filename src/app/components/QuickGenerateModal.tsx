import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuickGenerate } from '@/context/QuickGenerateContext';
import { useStyleSync } from '@/context/StyleSyncContext';
import { useAuth } from '@/context/AuthContext';
import { OutfitGenerateControls, type GenerateParams } from './OutfitGenerateControls';
import { OutfitCard } from './OutfitCard';
import { OutfitGridSkeleton } from './ShimmerSkeleton';
import type { Outfit } from '@/lib/api';

export function QuickGenerateModal() {
  const { isOpen, closeQuickGenerate } = useQuickGenerate();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { weather, memory, generateOutfits, loading, setLastOutfits } = useStyleSync();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [params, setParams] = useState<GenerateParams>({
    occasion: 'Daily Casual',
    mood: 'Stylish',
    stylePreference: 'Smart Casual',
    notes: '',
  });

  const runGenerate = async (mode: 'fresh' | 'variation' = 'fresh') => {
    const result = await generateOutfits({
      occasion: params.occasion,
      mood: params.mood.toLowerCase(),
      stylePreference: params.stylePreference.toLowerCase().replace(/ /g, '-'),
      notes: params.notes,
      location: user?.profile?.location,
      weather: weather || undefined,
      mode,
      seed: Date.now(),
      count: 3,
    });
    setOutfits(result);
    setLastOutfits(result);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeQuickGenerate}
        />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="relative z-10 w-full md:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-gradient-to-br from-[#FAFAFC] via-[#F5F0FF] to-[#FFF5F7] shadow-2xl border border-white/50"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[#7C6CFF]/10 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7C6CFF]" />
              <h2 className="text-xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
                New Outfit
              </h2>
            </div>
            <button onClick={closeQuickGenerate} className="p-2 rounded-xl hover:bg-[#7C6CFF]/10">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            {memory?.repeatWarning && (
              <p className="text-xs mb-4 px-3 py-2 rounded-xl bg-[#FFC98B]/15 text-foreground/70" style={{ fontFamily: 'var(--font-poppins)' }}>
                💡 {memory.repeatWarning}
              </p>
            )}

            <OutfitGenerateControls
              compact
              params={params}
              onChange={(patch) => setParams((p) => ({ ...p, ...patch }))}
              onGenerate={() => runGenerate('fresh')}
              onVariation={() => runGenerate('variation')}
              loading={loading}
              loadingLabel="AI is styling your look..."
            />

            {loading ? (
              <OutfitGridSkeleton count={3} />
            ) : outfits.length > 0 ? (
              <div className="grid gap-4 mt-4">
                {outfits.map((o, i) => (
                  <OutfitCard key={o.id} outfit={o} index={i} onSelect={() => { setLastOutfits([o]); closeQuickGenerate(); navigate('/app/stylist'); }} />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-foreground/50 py-8" style={{ fontFamily: 'var(--font-poppins)' }}>
                Tap Generate to get 3 outfit ideas instantly
              </p>
            )}

            <button
              onClick={() => { closeQuickGenerate(); navigate('/app/studio'); }}
              className="w-full mt-4 py-3 rounded-2xl border border-[#7C6CFF]/20 text-[#7C6CFF] flex items-center justify-center gap-2 hover:bg-[#7C6CFF]/5"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Open full Outfit Studio
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function QuickGenerateFAB() {
  const { openQuickGenerate } = useQuickGenerate();

  return (
    <motion.button
      type="button"
      onClick={openQuickGenerate}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 px-6 py-4 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white shadow-2xl shadow-[#7C6CFF]/40 flex items-center gap-2 hover:shadow-[#FF6B81]/30 md:bottom-8 md:right-8"
      style={{ fontFamily: 'var(--font-poppins)' }}
      aria-label="Generate new outfit"
    >
      <span className="text-lg">✨</span>
      <span className="font-medium text-sm hidden sm:inline">New Outfit</span>
    </motion.button>
  );
}

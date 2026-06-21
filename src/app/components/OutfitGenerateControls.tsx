import { RefreshCw, Sparkles, Wand2, Plane, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OCCASIONS = ['College', 'Office', 'Party', 'Interview', 'Travel', 'Date', 'Wedding', 'Casual outing'];
export const MOODS = ['Confident', 'Relaxed', 'Bold', 'Minimal', 'Stylish', 'Chill'];
export const STYLES = ['Streetwear', 'Smart Casual', 'Minimal', 'Luxury', 'Korean', 'Vintage', 'Clean Fit', 'Formal'];

export interface GenerateParams {
  occasion: string;
  mood: string;
  stylePreference: string;
  notes: string;
  currentLocation?: string;
  destinationLocation?: string;
  useDestination?: boolean;
}

interface OutfitGenerateControlsProps {
  params: GenerateParams;
  onChange: (patch: Partial<GenerateParams>) => void;
  onGenerate: () => void;
  onVariation?: () => void;
  loading?: boolean;
  loadingLabel?: string;
  compact?: boolean;
  sticky?: boolean;
}

export function OutfitGenerateControls({
  params,
  onChange,
  onGenerate,
  onVariation,
  loading,
  loadingLabel = 'Generating outfits...',
  compact,
  sticky,
}: OutfitGenerateControlsProps) {
  const wrapperClass = sticky
    ? 'sticky top-0 z-20 -mx-6 md:-mx-8 px-6 md:px-8 py-4 mb-6 bg-white/70 backdrop-blur-xl border-b border-[#7C6CFF]/10'
    : 'mb-6';


  return (
    <div className={wrapperClass}>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#7C6CFF]/10 to-[#FF6B81]/10 border border-[#7C6CFF]/15"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-[#7C6CFF]" />
          </motion.div>
          <span className="text-sm text-[#7C6CFF]" style={{ fontFamily: 'var(--font-poppins)' }}>
            {loadingLabel}
          </span>
        </motion.div>
      )}

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        <SelectField label="Occasion" value={params.occasion} options={OCCASIONS} onChange={(v) => onChange({ occasion: v })} />
        <SelectField label="Mood" value={params.mood} options={MOODS} onChange={(v) => onChange({ mood: v })} />
        <SelectField label="Style" value={params.stylePreference} options={STYLES} onChange={(v) => onChange({ stylePreference: v })} />
        {!compact && (
          <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
            <span className="text-xs text-foreground/50" style={{ fontFamily: 'var(--font-poppins)' }}>Quick mood</span>
            <div className="flex flex-wrap gap-1">
              {MOODS.slice(0, 4).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onChange({ mood: m })}
                  className={`px-2 py-1 rounded-full text-[10px] transition-all ${
                    params.mood === m ? 'bg-[#7C6CFF] text-white' : 'bg-[#7C6CFF]/5 text-foreground/60'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {!compact && (
        <textarea
          value={params.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Optional notes (layers, no heels, pop of color...)"
          className="w-full mt-3 px-4 py-3 rounded-2xl bg-white/80 border border-[#7C6CFF]/10 focus:ring-2 focus:ring-[#7C6CFF]/20 outline-none resize-none h-16 text-sm"
          style={{ fontFamily: 'var(--font-poppins)' }}
        />
      )}

      {!compact && (
        <div className="mt-3 p-4 rounded-2xl bg-white/50 border border-[#7C6CFF]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#7C6CFF]" />
              <span className="text-xs font-semibold text-foreground/70" style={{ fontFamily: 'var(--font-poppins)' }}>
                Travel Weather Routing
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={params.useDestination || false}
                onChange={(e) => onChange({ useDestination: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7C6CFF]" />
              <span className="ml-2 text-[11px] text-foreground/60 font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                Optimize for Destination Weather
              </span>
            </label>
          </div>

          <AnimatePresence>
            {params.useDestination && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden"
              >
                <div>
                  <label className="text-[10px] text-foreground/50 block mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Current Location (Home)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                      type="text"
                      value={params.currentLocation || ''}
                      onChange={(e) => onChange({ currentLocation: e.target.value })}
                      placeholder="e.g. Jaipur"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#7C6CFF]/15 text-xs focus:outline-none focus:border-[#7C6CFF] transition-all"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-foreground/50 block mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Destination Location (Travel)
                  </label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF6B81] shrink-0" />
                    <input
                      type="text"
                      value={params.destinationLocation || ''}
                      onChange={(e) => onChange({ destinationLocation: e.target.value })}
                      placeholder="e.g. Ajmer"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#7C6CFF]/15 text-xs focus:outline-none focus:border-[#7C6CFF] transition-all"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}


      <div className="flex flex-wrap gap-3 mt-4">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="flex-1 min-w-[140px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white hover:shadow-lg hover:shadow-[#7C6CFF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <Wand2 className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          Generate Outfits
        </button>
        {onVariation && (
          <button
            type="button"
            onClick={onVariation}
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-white/90 border border-[#7C6CFF]/20 hover:border-[#7C6CFF]/40 flex items-center gap-2 disabled:opacity-60"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <RefreshCw className={`w-5 h-5 text-[#7C6CFF] ${loading ? 'animate-spin' : ''}`} />
            New Variations
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="p-3 rounded-2xl bg-white/80 border border-white/50">
      <label className="text-xs text-foreground/50 block mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm outline-none font-medium"
        style={{ fontFamily: 'var(--font-poppins)' }}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

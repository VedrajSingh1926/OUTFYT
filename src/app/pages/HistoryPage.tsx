import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, MessageCircle, Heart, Wand2, Clock } from 'lucide-react';
import { useStyleSync } from '@/context/StyleSyncContext';
import { useQuickGenerate } from '@/context/QuickGenerateContext';
import { EmptyState } from '../components/EmptyState';
import type { HistoryEntry } from '@/lib/api';

const TYPE_META: Record<string, { icon: typeof Sparkles; label: string; color: string }> = {
  outfit_session: { icon: Wand2, label: 'Outfit Session', color: '#7C6CFF' },
  chat: { icon: MessageCircle, label: 'AI Chat', color: '#FF6B81' },
  saved: { icon: Heart, label: 'Saved Look', color: '#3DD9B4' },
};

export function HistoryPage() {
  const { openQuickGenerate } = useQuickGenerate();
  const { history, refreshHistory } = useStyleSync();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = history.filter((h) => {
    if (filter !== 'all' && h.type !== filter) return false;
    if (!query) return true;
    return JSON.stringify(h).toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
          Style History
        </h1>
        <p className="text-lg text-foreground/60" style={{ fontFamily: 'var(--font-caveat)' }}>
          Sessions, outfits, refinements & conversations
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 border border-[#7C6CFF]/10 focus:ring-2 focus:ring-[#7C6CFF]/20 outline-none"
            style={{ fontFamily: 'var(--font-poppins)' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'outfit_session', 'chat', 'saved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === f ? 'bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white' : 'bg-white/80 border border-[#7C6CFF]/10'
              }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {f === 'all' ? 'All' : TYPE_META[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            emoji="📜"
            title="No styling history yet"
            description="Every outfit session and AI chat will appear here. Start generating to build your style timeline."
            actionLabel="Generate Outfits"
            onAction={openQuickGenerate}
          />
        ) : (
          filtered.map((entry, i) => (
            <HistoryCard key={entry.id} entry={entry} index={i} />
          ))
        )}
      </div>

      <button onClick={() => refreshHistory()} className="mt-6 text-sm text-[#7C6CFF] hover:underline" style={{ fontFamily: 'var(--font-poppins)' }}>
        Refresh history
      </button>
    </div>
  );
}

function HistoryCard({ entry, index }: { entry: HistoryEntry; index: number }) {
  const meta = TYPE_META[entry.type] || TYPE_META.outfit_session;
  const Icon = meta.icon;
  const date = new Date(entry.createdAt).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.color}15` }}>
          <Icon className="w-6 h-6" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>{meta.label}</span>
            <span className="text-xs text-foreground/40 flex items-center gap-1 shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
              <Clock className="w-3 h-3" />
              {date}
            </span>
          </div>
          {entry.preview && (
            <p className="text-sm text-foreground/60 truncate" style={{ fontFamily: 'var(--font-poppins)' }}>{entry.preview}</p>
          )}
          {entry.outfits && (
            <div className="flex flex-wrap gap-2 mt-2">
              {entry.outfits.slice(0, 3).map((o, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-[#7C6CFF]/5 text-xs" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {o.emoji} {o.name}
                </span>
              ))}
            </div>
          )}
          {entry.outfit && (
            <p className="text-sm mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>
              {entry.outfit.emoji} {entry.outfit.name}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

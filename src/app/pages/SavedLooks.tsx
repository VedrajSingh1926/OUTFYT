import { motion } from 'motion/react';
import { Heart, Trash2, FolderPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStyleSync } from '@/context/StyleSyncContext';
import { useQuickGenerate } from '@/context/QuickGenerateContext';
import { EmptyState } from '../components/EmptyState';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function SavedLooks() {
  const { openQuickGenerate } = useQuickGenerate();
  const { savedLooks, refreshSaved } = useStyleSync();
  const [collections, setCollections] = useState<{ id: string; name: string; color: string }[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const loadCollections = async () => {
    const { collections: c } = await api.saved.list();
    setCollections(c);
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const filtered = activeCollection
    ? savedLooks.filter((l) => l.collectionId === activeCollection)
    : savedLooks;

  const handleDelete = async (id: string) => {
    await api.saved.remove(id);
    refreshSaved();
    toast.success('Removed from saved looks');
  };

  const createCollection = async () => {
    const name = prompt('Collection name (e.g. College, Date Night)');
    if (!name) return;
    await api.saved.createCollection(name);
    loadCollections();
    toast.success('Collection created');
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
            Saved Looks
          </h1>
          <p className="text-lg text-foreground/60" style={{ fontFamily: 'var(--font-caveat)' }}>
            Organize outfits into collections
          </p>
        </div>
        <button onClick={createCollection} className="px-5 py-3 rounded-2xl bg-white/80 border border-[#7C6CFF]/20 flex items-center gap-2 hover:shadow-md" style={{ fontFamily: 'var(--font-poppins)' }}>
          <FolderPlus className="w-5 h-5 text-[#7C6CFF]" />
          New Collection
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setActiveCollection(null)} className={`px-4 py-2 rounded-full text-sm ${!activeCollection ? 'bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white' : 'bg-white/80'}`} style={{ fontFamily: 'var(--font-poppins)' }}>All</button>
        {collections.map((c) => (
          <button key={c.id} onClick={() => setActiveCollection(c.id)} className={`px-4 py-2 rounded-full text-sm ${activeCollection === c.id ? 'bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white' : 'bg-white/80'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved looks yet"
          description="When you love an outfit, save it from Outfit Studio. Build collections for college, dates, office & more."
          actionLabel="Generate & Save"
          onAction={() => { openQuickGenerate(); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((look, i) => (
            <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-3xl bg-white/90 border border-white/50 shadow-lg overflow-hidden group">
              <div className={`p-8 bg-gradient-to-br ${look.gradient || 'from-[#7C6CFF] to-[#B8A9FF]'} text-white relative`}>
                <button onClick={() => handleDelete(look.id)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-6xl mb-3">{look.emoji}</div>
                <h3 className="text-2xl" style={{ fontFamily: 'var(--font-dancing)' }}>{look.name}</h3>
                <p className="text-sm opacity-90 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{look.confidence}% · {look.occasion}</p>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {look.items?.slice(0, 4).map((item, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-[#7C6CFF]/5" style={{ fontFamily: 'var(--font-poppins)' }}>{item}</span>
                  ))}
                </div>
                {look.savedAt && (
                  <p className="text-xs text-foreground/40 mt-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Saved {new Date(look.savedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

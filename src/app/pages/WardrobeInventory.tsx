import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Shirt, X, Heart } from 'lucide-react';
import { useStyleSync } from '@/context/StyleSyncContext';
import { api, type WardrobeItem } from '@/lib/api';
import { WARDROBE_CATEGORIES, WARDROBE_SUGGESTIONS } from '@/lib/wardrobeCategories';
import { WardrobeItemEditor, MergeDuplicatesButton } from '../components/WardrobeItemEditor';
import { EmptyState } from '../components/EmptyState';
import { useQuickGenerate } from '@/context/QuickGenerateContext';
import { toast } from 'sonner';

const TABS = [
  { id: 'all', label: 'All Items' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'recent', label: 'Recently Used' },
  { id: 'archived', label: 'Archived' },
];

const CATEGORY_EMOJI: Record<string, string> = {
  tops: '👕', bottoms: '👖', dresses: '👗', outerwear: '🧥', shoes: '👟', accessories: '👜',
};

export function WardrobeInventory() {
  const { wardrobe, refreshWardrobe } = useStyleSync();
  const { openQuickGenerate } = useQuickGenerate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [manualText, setManualText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [previewItems, setPreviewItems] = useState<{ name: string; category: string; color: string }[]>([]);

  const filtered = wardrobe.filter((item) => {
    if (activeTab === 'archived') return !!item.archived;
    if (item.archived) return false;
    if (activeTab === 'favorites' && !item.favorite) return false;
    if (activeTab === 'recent' && !item.recentlyUsed) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handlePreviewAdd = async () => {
    if (!manualText.trim()) return;
    try {
      const { items } = await api.wardrobe.preview(manualText);
      setPreviewItems(items);
    } catch {
      toast.error('Could not parse items');
    }
  };

  const confirmAdd = async () => {
    if (previewItems.length) {
      await api.wardrobe.confirm(previewItems);
    } else if (manualText.trim()) {
      await api.wardrobe.addText(manualText);
    }
    setManualText('');
    setPreviewItems([]);
    setShowAdd(false);
    refreshWardrobe();
    toast.success('Wardrobe updated');
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    await api.wardrobe.update(id, { favorite: !current });
    refreshWardrobe();
  };

  if (wardrobe.length === 0 && !showAdd) {
    return (
      <div className="p-6 md:p-8">
        <EmptyState
          icon={Shirt}
          title="Your wardrobe is empty"
          description="Add clothes manually or complete onboarding. Then generate outfits instantly."
          actionLabel="✨ Generate First Outfit"
          onAction={openQuickGenerate}
        />
        <div className="mt-6 text-center">
          <button onClick={() => setShowAdd(true)} className="text-[#7C6CFF] text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
            + Add wardrobe items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
            Your Wardrobe
          </h1>
          {wardrobe.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
              <span className="px-3 py-1 bg-white/80 border border-[#7C6CFF]/15 rounded-lg text-foreground/70 shadow-sm">
                <strong className="text-[#7C6CFF]">{wardrobe.length}</strong> items analyzed
              </span>
              <span className="px-3 py-1 bg-white/80 border border-[#3DD9B4]/15 rounded-lg text-foreground/70 shadow-sm">
                AI Confidence: <strong className="text-[#3DD9B4]">
                  {Math.round((wardrobe.reduce((acc, item) => acc + (item.confidence || 0.95), 0) / wardrobe.length) * 100)}%
                </strong>
              </span>
              <span className="text-xs text-foreground/40 hidden sm:block">
                Last updated recently
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <MergeDuplicatesButton onMerged={refreshWardrobe} />
          <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white flex items-center gap-2 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
            <Plus className="w-4 h-4" /> Add Items
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search wardrobe..." className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 border border-[#7C6CFF]/10 focus:ring-2 focus:ring-[#7C6CFF]/20 outline-none" style={{ fontFamily: 'var(--font-poppins)' }} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white' : 'bg-white/80 border border-[#7C6CFF]/10'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-xl text-sm ${selectedCategory === 'all' ? 'bg-[#7C6CFF]/15 text-[#7C6CFF]' : 'bg-white/60'}`} style={{ fontFamily: 'var(--font-poppins)' }}>all</button>
        {WARDROBE_CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`px-3 py-1.5 rounded-xl text-sm capitalize ${selectedCategory === c.id ? 'bg-[#7C6CFF]/15 text-[#7C6CFF]' : 'bg-white/60'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => setEditingItem(item)}
            className="p-5 rounded-2xl bg-white/80 border border-white/50 hover:shadow-lg hover:border-[#7C6CFF]/20 transition-all text-left group relative"
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id, !!item.favorite); }}
              className="absolute top-3 right-3 z-10"
            >
              <Heart className={`w-4 h-4 ${item.favorite ? 'fill-[#FF6B81] text-[#FF6B81]' : 'text-foreground/25 group-hover:text-[#FF6B81]/50'}`} />
            </button>
            <div className="text-4xl mb-2">{CATEGORY_EMOJI[item.category] || '👔'}</div>
            <h3 className="text-sm font-medium line-clamp-2 pr-6" style={{ fontFamily: 'var(--font-poppins)' }}>{item.name}</h3>
            <p className="text-xs text-foreground/50 capitalize mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>{item.category} · {item.color}</p>
            {(item.confidence !== undefined && item.confidence < 0.8) && (
              <span className="text-[10px] text-[#FFC98B] mt-1 block" style={{ fontFamily: 'var(--font-poppins)' }}>Tap to fix category</span>
            )}
          </motion.button>
        ))}
      </div>

      {editingItem && (
        <WardrobeItemEditor item={editingItem} onClose={() => setEditingItem(null)} onUpdated={refreshWardrobe} />
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setShowAdd(false)} className="absolute top-4 right-4"><X /></button>
            <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-dancing)' }}>Add Items</h3>
            <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="One per line: white sneakers, navy blazer..." className="w-full h-28 p-4 rounded-2xl border border-[#7C6CFF]/10 outline-none mb-3" style={{ fontFamily: 'var(--font-poppins)' }} />
            <div className="flex flex-wrap gap-2 mb-4">
              {WARDROBE_SUGGESTIONS.slice(0, 5).map((s) => (
                <button key={s} type="button" onClick={() => setManualText((t) => (t ? `${t}\n${s}` : s))} className="text-xs px-2 py-1 rounded-full bg-[#7C6CFF]/5">{s}</button>
              ))}
            </div>
            <button type="button" onClick={handlePreviewAdd} className="w-full py-2 mb-3 rounded-xl border border-[#7C6CFF]/20 text-[#7C6CFF] text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>Preview AI categories</button>
            {previewItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {previewItems.map((item, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#3DD9B4]/10 border border-[#3DD9B4]/20" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {item.category}: {item.name}
                  </span>
                ))}
              </div>
            )}
            <button type="button" onClick={confirmAdd} className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Confirm & Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { X, Trash2, Merge } from 'lucide-react';
import { motion } from 'motion/react';
import { api, type WardrobeItem } from '@/lib/api';
import { WARDROBE_CATEGORIES } from '@/lib/wardrobeCategories';
import { toast } from 'sonner';

interface WardrobeItemEditorProps {
  item: WardrobeItem;
  onClose: () => void;
  onUpdated: () => void;
}

export function WardrobeItemEditor({ item, onClose, onUpdated }: WardrobeItemEditorProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [color, setColor] = useState(item.color);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.wardrobe.update(item.id, { name, category, color });
      onUpdated();
      onClose();
      toast.success('Item updated');
    } catch {
      toast.error('Could not save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await api.wardrobe.remove(item.id);
    onUpdated();
    onClose();
    toast.success('Item removed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#7C6CFF]/10">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-2xl mb-6 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
          Edit Item
        </h3>
        <div className="space-y-4">
          <Field label="Name" value={name} onChange={setName} />
          <div>
            <label className="text-sm text-foreground/60 block mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#7C6CFF]/10 outline-none"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {WARDROBE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <Field label="Color" value={color} onChange={setColor} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={save} disabled={saving} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={remove} className="px-4 py-3 rounded-2xl border border-[#FF6B81]/30 text-[#FF6B81]" aria-label="Delete">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-foreground/60 block mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-[#7C6CFF]/10 outline-none focus:ring-2 focus:ring-[#7C6CFF]/20"
        style={{ fontFamily: 'var(--font-poppins)' }}
      />
    </div>
  );
}

export function MergeDuplicatesButton({ onMerged }: { onMerged: () => void }) {
  const [loading, setLoading] = useState(false);

  const merge = async () => {
    setLoading(true);
    try {
      const { merged, groups } = await api.wardrobe.mergeDuplicates();
      onMerged();
      toast.success(merged ? `Merged ${merged} duplicate(s)` : 'No duplicates found');
      if (!groups) return;
    } catch {
      toast.error('Merge failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={merge}
      disabled={loading}
      className="px-4 py-2 rounded-xl bg-white/80 border border-[#7C6CFF]/15 text-sm flex items-center gap-2 hover:border-[#7C6CFF]/30 disabled:opacity-50"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      <Merge className="w-4 h-4 text-[#7C6CFF]" />
      {loading ? 'Merging...' : 'Merge duplicates'}
    </button>
  );
}

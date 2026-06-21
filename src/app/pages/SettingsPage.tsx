import { useState, useEffect } from 'react';
import { User, Bell, Palette, MapPin, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [favoriteColors, setFavoriteColors] = useState((user?.profile?.favoriteColors || []).join(', '));
  const [blockedColors, setBlockedColors] = useState((user?.profile?.blockedColors || []).join(', '));
  const [preferredStyle, setPreferredStyle] = useState(user?.profile?.preferredStyles?.[0] || 'smart-casual');
  const [preferredMood, setPreferredMood] = useState(user?.profile?.preferredMood || 'stylish');
  const [notifications, setNotifications] = useState(user?.profile?.notifications !== false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setLocation(user?.profile?.location || '');
    setFavoriteColors((user?.profile?.favoriteColors || []).join(', '));
    setBlockedColors((user?.profile?.blockedColors || []).join(', '));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.user.updateProfile({
        name,
        location,
        favoriteColors: favoriteColors.split(',').map((c) => c.trim()).filter(Boolean),
        blockedColors: blockedColors.split(',').map((c) => c.trim()).filter(Boolean),
        preferredStyles: [preferredStyle],
        preferredMood,
        notifications,
      });
      await refreshUser();
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl mb-8 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
          Settings
        </h1>

        <div className="space-y-6">
          <Section icon={User} title="Account" color="#7C6CFF">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Email" value={user?.email || ''} onChange={() => {}} disabled />
          </Section>

          <Section icon={Sparkles} title="AI Personalization" color="#FF6B81">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm block mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Default Style</label>
                <select value={preferredStyle} onChange={(e) => setPreferredStyle(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#7C6CFF]/10" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {['streetwear', 'smart-casual', 'minimal', 'luxury', 'formal'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm block mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>Default Mood</label>
                <select value={preferredMood} onChange={(e) => setPreferredMood(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#7C6CFF]/10" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {['confident', 'relaxed', 'bold', 'minimal', 'stylish', 'chill'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          <Section icon={Palette} title="Color Preferences" color="#3DD9B4">
            <Field label="Favorite colors (comma-separated)" value={favoriteColors} onChange={setFavoriteColors} placeholder="navy, beige, white" />
            <Field label="Blocked colors" value={blockedColors} onChange={setBlockedColors} placeholder="neon, orange" />
          </Section>

          <Section icon={MapPin} title="Weather & Location" color="#FFC98B">
            <Field label="City" value={location} onChange={setLocation} placeholder="Jaipur, Delhi, Ajmer..." />
          </Section>

          <Section icon={Bell} title="Notifications" color="#7C6CFF">
            <label className="flex items-center justify-between cursor-pointer">
              <span style={{ fontFamily: 'var(--font-poppins)' }}>Outfit & weather alerts</span>
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="w-5 h-5 accent-[#7C6CFF]" />
            </label>
          </Section>

          <Section icon={Shield} title="Privacy" color="#6B6B7B">
            <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
              Wardrobe images are processed securely. Selfies are optional and never shared. You control wardrobe permissions in your profile.
            </p>
          </Section>

          <button onClick={handleSave} disabled={saving} className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white hover:shadow-lg disabled:opacity-50" style={{ fontFamily: 'var(--font-poppins)' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, color, children }: { icon: typeof User; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50">
      <div className="flex items-center gap-4 mb-6">
        <Icon className="w-6 h-6" style={{ color }} />
        <h2 className="text-2xl" style={{ fontFamily: 'var(--font-caveat)' }}>{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-sm mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} className="w-full px-4 py-3 rounded-2xl bg-white border border-[#7C6CFF]/10 focus:ring-2 focus:ring-[#7C6CFF]/20 outline-none disabled:opacity-60" style={{ fontFamily: 'var(--font-poppins)' }} />
    </div>
  );
}

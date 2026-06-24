import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sun, Calendar, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Shirt } from 'lucide-react';
import { LogoMain } from '../components/Logo';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const OCCASIONS = [
  { id: 'casual', label: 'Casual Outing', desc: 'Everyday comfortable wear', icon: '👕' },
  { id: 'work', label: 'Work / Office', desc: 'Professional and polished', icon: '💼' },
  { id: 'party', label: 'Party / Clubbing', desc: 'Bold and standout looks', icon: '✨' },
  { id: 'date', label: 'Date Night', desc: 'Chic and romantic style', icon: '🌹' },
  { id: 'travel', label: 'Travel / Adventure', desc: 'Functional and versatile', icon: '✈️' },
  { id: 'formal', label: 'Formal Events', desc: 'Elegant and tailored suits', icon: '👔' }
];

const MOODS = [
  { id: 'confident', label: 'Confident', bg: 'from-[#7C6CFF] to-[#B8A9FF]', icon: '⚡' },
  { id: 'relaxed', label: 'Relaxed', bg: 'from-[#3DD9B4] to-[#7FEED8]', icon: '🍃' },
  { id: 'bold', label: 'Bold', bg: 'from-[#FFC98B] to-[#FFE0B8]', icon: '🔥' },
  { id: 'stylish', label: 'Stylish', bg: 'from-[#FF6B81] to-[#FFA3B3]', icon: '🕶️' },
  { id: 'minimal', label: 'Minimal', bg: 'from-[#6B6B7B] to-[#9B9BAB]', icon: '⚪' }
];

const STYLES = [
  { id: 'smart-casual', label: 'Smart Casual', desc: 'Balanced business & leisure', icon: '👔' },
  { id: 'streetwear', label: 'Streetwear', desc: 'Graphic tees, cargo, sneakers', icon: '👟' },
  { id: 'minimal', label: 'Minimalist', desc: 'Neutral tones and clean cuts', icon: '🎯' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro cuts and timeless classics', icon: '🕰️' },
  { id: 'oversized', label: 'Oversized', desc: 'Relaxed, boxy, comfortable', icon: '🧸' }
];

const STEPS = [
  { number: 1, title: 'Location & Weather', desc: 'Help us calibrate outfit recommendations for your local climate.' },
  { number: 2, title: 'Your Occasions', desc: 'Select occasions you style for most frequently.' },
  { number: 3, title: 'Daily Vibes', desc: 'Which mood best matches your typical styling energy?' },
  { number: 4, title: 'Preferred Styles', desc: 'Choose the aesthetic directions that match your taste.' },
  { number: 5, title: 'Selfie & Skin Tone', desc: 'Optimize color matching with your skin tone (Optional).' },
  { number: 6, title: 'Wardrobe Setup', desc: 'Quickly list a few key wardrobe items to kick off your database.' }
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [location, setLocation] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('stylish');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [wardrobeText, setWardrobeText] = useState('');

  const nextStep = () => {
    if (step === 1 && !location.trim()) {
      toast.error('Please enter your city to fetch local weather context.');
      return;
    }
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleOccasionToggle = (id: string) => {
    setSelectedOccasions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStyleToggle = (id: string) => {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        location,
        occasions: selectedOccasions,
        mood: selectedMood,
        styles: selectedStyles,
        skinTone,
        wardrobeText: wardrobeText.trim() ? wardrobeText : undefined,
      };

      await api.user.completeOnboarding(payload);
      toast.success('Onboarding complete! Welcome to OUTFYT.');
      await refreshUser();
      navigate('/app/stylist', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Onboarding failed, using bypass.');
      navigate('/app/stylist', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <LogoMain size="sm" />
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">
            Step {step} of {STEPS.length}
          </div>
          <div className="h-1.5 w-32 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7C6CFF] transition-all duration-500 ease-out" 
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm min-h-[480px] flex flex-col justify-between relative overflow-hidden">
          
          {/* Header Info */}
          <div>
            <div className="text-[#7C6CFF] font-bold text-sm uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
              {STEPS[step - 1].title}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
              {STEPS[step - 1].title}
            </h1>
            <p className="text-foreground/60 font-medium mb-8 max-w-2xl leading-relaxed">
              {STEPS[step - 1].desc}
            </p>

            {/* Dynamic Step Content */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Location & Weather */}
                  {step === 1 && (
                    <div className="max-w-md">
                      <label className="block text-sm font-semibold text-foreground/80 mb-3">
                        Where do you style yourself?
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Jaipur, Delhi, Mumbai, London"
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#FAFAFC] border border-border focus:border-[#7C6CFF] focus:outline-none focus:ring-4 focus:ring-[#7C6CFF]/10 transition-all font-medium text-foreground"
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-3 p-4 bg-[#7C6CFF]/5 border border-[#7C6CFF]/10 rounded-2xl">
                        <Sun className="w-5 h-5 text-[#7C6CFF]" />
                        <span className="text-sm font-medium text-foreground/70">
                          We will sync local temperatures and weather forecasts to tailor layers and fabrics.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Occasions */}
                  {step === 2 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {OCCASIONS.map((occ) => {
                        const isSelected = selectedOccasions.includes(occ.id);
                        return (
                          <button
                            key={occ.id}
                            onClick={() => handleOccasionToggle(occ.id)}
                            className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 relative ${
                              isSelected
                                ? 'border-[#7C6CFF] bg-[#7C6CFF]/5 shadow-sm'
                                : 'border-border hover:border-foreground/30 hover:bg-[#FAFAFC]'
                            }`}
                          >
                            <span className="text-2xl mb-3">{occ.icon}</span>
                            <span className="font-bold text-foreground mb-1">{occ.label}</span>
                            <span className="text-xs text-foreground/50 leading-snug">{occ.desc}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#7C6CFF] absolute top-4 right-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Step 3: Moods */}
                  {step === 3 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {MOODS.map((m) => {
                        const isSelected = selectedMood === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMood(m.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-300 relative ${
                              isSelected
                                ? 'border-[#7C6CFF] bg-[#7C6CFF]/5 shadow-sm scale-105'
                                : 'border-border hover:border-foreground/30 hover:bg-[#FAFAFC]'
                            }`}
                          >
                            <span className="text-3xl mb-3">{m.icon}</span>
                            <span className="font-bold text-foreground mb-2">{m.label}</span>
                            <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${m.bg}`} />
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#7C6CFF] absolute top-3 right-3" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Step 4: Style Preferences */}
                  {step === 4 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {STYLES.map((s) => {
                        const isSelected = selectedStyles.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => handleStyleToggle(s.id)}
                            className={`flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 relative ${
                              isSelected
                                ? 'border-[#7C6CFF] bg-[#7C6CFF]/5 shadow-sm'
                                : 'border-border hover:border-foreground/30 hover:bg-[#FAFAFC]'
                            }`}
                          >
                            <span className="text-2xl mb-3">{s.icon}</span>
                            <span className="font-bold text-foreground mb-1">{s.label}</span>
                            <span className="text-xs text-foreground/50 leading-snug">{s.desc}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#7C6CFF] absolute top-4 right-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Step 5: Selfie & Skin Tone (Optional) */}
                  {step === 5 && (
                    <div className="max-w-xl">
                      <label className="block text-sm font-semibold text-foreground/80 mb-3">
                        Choose your tone family (Optional)
                      </label>
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        {[
                          { id: 'fair', label: 'Fair / Cool', color: 'bg-[#FFECE1]' },
                          { id: 'warm-fair', label: 'Warm Fair', color: 'bg-[#FBE0D0]' },
                          { id: 'medium', label: 'Medium', color: 'bg-[#D2B295]' },
                          { id: 'deep', label: 'Deep / Dark', color: 'bg-[#6D4C3A]' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSkinTone(skinTone === t.id ? null : t.id)}
                            className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                              skinTone === t.id ? 'border-[#7C6CFF] bg-[#7C6CFF]/5' : 'border-border'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full ${t.color} mb-3 shadow-inner`} />
                            <span className="text-xs font-bold text-foreground">{t.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="p-4 bg-[#FF6B81]/5 border border-[#FF6B81]/10 rounded-2xl flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#FF6B81]" />
                        <span className="text-sm font-medium text-foreground/70">
                          We use this parameters locally to suggest color harmonies that contrast beautifully.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Wardrobe Setup */}
                  {step === 6 && (
                    <div className="max-w-xl">
                      <label className="block text-sm font-semibold text-foreground/80 mb-3">
                        List a few items you own (Optional)
                      </label>
                      <textarea
                        value={wardrobeText}
                        onChange={(e) => setWardrobeText(e.target.value)}
                        placeholder="e.g. Navy blazer, white button-up shirt, blue jeans, white leather sneakers"
                        className="w-full h-32 p-4 rounded-2xl bg-[#FAFAFC] border border-border focus:border-[#7C6CFF] focus:outline-none focus:ring-4 focus:ring-[#7C6CFF]/10 transition-all font-medium text-foreground resize-none"
                      />
                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-foreground/40">
                        <Shirt className="w-4 h-4" />
                        <span>Separate items with commas. You can add images later in the app!</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-border mt-8">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-foreground/70 font-semibold transition-all hover:bg-[#FAFAFC] ${
                step === 1 ? 'opacity-30 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3.5 bg-foreground text-background font-semibold rounded-2xl hover:bg-foreground/90 transition-all shadow-md"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#7C6CFF] text-white font-semibold rounded-2xl hover:bg-[#5B4AE0] transition-all shadow-md"
              >
                {submitting ? 'Setting up...' : 'Complete Styling Setup'} <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs font-semibold text-foreground/40 border-t border-border bg-white">
        © 2026 OUTFYT. All rights reserved.
      </footer>
    </div>
  );
}

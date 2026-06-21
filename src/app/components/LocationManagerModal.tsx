import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Plane, CloudLightning, Navigation, Loader2 } from 'lucide-react';
import { useStyleSync } from '@/context/StyleSyncContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function LocationManagerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    globalCurrentLocation,
    setGlobalCurrentLocation,
    globalDestinationLocation,
    setGlobalDestinationLocation,
    fetchWeather
  } = useStyleSync();

  const [currentInput, setCurrentInput] = useState(globalCurrentLocation || '');
  const [destInput, setDestInput] = useState(globalDestinationLocation || '');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetect = () => {
    setIsDetecting(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { weather } = await api.weather.coords(pos.coords.latitude, pos.coords.longitude);
          setCurrentInput(weather.location);
          setGlobalCurrentLocation(weather.location);
          await fetchWeather(weather.location);
          toast.success('Location updated');
        } catch {
          toast.error('Failed to parse location');
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        toast.error('Location permission denied');
        setIsDetecting(false);
      }
    );
  };

  const handleSave = async () => {
    setGlobalCurrentLocation(currentInput);
    setGlobalDestinationLocation(destInput);
    
    if (currentInput) {
      await fetchWeather(currentInput);
    }
    
    onClose();
    if (destInput) {
      toast.success('Travel mode activated');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#7C6CFF]/10"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-[#FAFAFC] to-[#F5F0FF] border-b border-[#7C6CFF]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7C6CFF]/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#7C6CFF]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Location Settings
                  </h2>
                  <p className="text-xs text-foreground/60 font-medium mt-0.5">
                    Optimize AI styling for your local weather or travel.
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5 text-foreground/50" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Current Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7C6CFF]" /> Current City
                </label>
                <div className="flex gap-2">
                  <input
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder="e.g. New York, London"
                    className="flex-1 rounded-2xl bg-[#FAFAFC] border border-border/80 focus:border-[#7C6CFF] focus:outline-none focus:ring-4 focus:ring-[#7C6CFF]/10 transition-all py-3 px-4 font-medium"
                  />
                  <button
                    onClick={handleDetect}
                    disabled={isDetecting}
                    className="px-4 rounded-2xl bg-[#7C6CFF]/10 text-[#7C6CFF] hover:bg-[#7C6CFF]/20 transition-all flex items-center justify-center font-medium disabled:opacity-50"
                  >
                    {isDetecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Destination / Travel Mode */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF6B81]/5 via-[#FAFAFC] to-[#FFC98B]/5 border border-[#FF6B81]/15">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Plane className="w-4 h-4 text-[#FF6B81]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Travel Mode</h3>
                    <p className="text-xs text-foreground/60">Planning a trip? AI will optimize for your destination.</p>
                  </div>
                </div>
                <input
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  placeholder="Destination city (Optional)"
                  className="w-full rounded-2xl bg-white border border-[#FF6B81]/20 focus:border-[#FF6B81] focus:outline-none focus:ring-4 focus:ring-[#FF6B81]/10 transition-all py-3 px-4 font-medium"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 bg-[#FAFAFC] border-t border-border flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-semibold text-foreground/60 hover:bg-black/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white font-semibold shadow-lg shadow-[#7C6CFF]/20 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <CloudLightning className="w-4 h-4" /> Save & Update AI
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

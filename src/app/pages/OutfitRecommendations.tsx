import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, ThumbsUp, Heart, RefreshCw, Cloud, Calendar, Smile,
  Palette, TrendingUp, X, Share2, Download
} from 'lucide-react';
import { useNavigate } from 'react-router';

export function OutfitRecommendations() {
  const navigate = useNavigate();
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null);
  const [savedOutfits, setSavedOutfits] = useState<number[]>([]);

  const outfits = [
    {
      id: 1,
      name: 'Smart Casual Executive',
      confidence: 98,
      items: ['Navy Blazer', 'White Button-Up', 'Black Jeans', 'Brown Leather Boots'],
      reasoning: 'Perfect for your client meeting. The blazer adds professionalism while dark jeans keep it approachable. Weather-appropriate for 68°F.',
      whyNot: 'White sneakers might reduce the formality needed for an executive setting. Consider loafers instead if the client is traditional.',
      weatherMatch: 95,
      moodMatch: 92,
      colorHarmony: 98,
      occasion: 'Work Meeting',
      emoji: '💼',
      gradient: 'bg-gray-900'
    },
    {
      id: 2,
      name: 'Elegant Minimalist',
      confidence: 95,
      items: ['Black Midi Skirt', 'Striped T-Shirt', 'Beige Trench Coat', 'Red Sneakers'],
      reasoning: 'Sophisticated yet comfortable. The trench coat works well with the cool morning temperature, and red sneakers add a stylish pop of color.',
      whyNot: 'The red sneakers might clash if you plan to wear other bright accessories. Keep the rest minimal.',
      weatherMatch: 94,
      moodMatch: 96,
      colorHarmony: 93,
      occasion: 'Casual Outing',
      emoji: '✨',
      gradient: 'bg-gray-800'
    },
    {
      id: 3,
      name: 'Relaxed Weekend Vibes',
      confidence: 92,
      items: ['Graphic Tee', 'Black Jeans', 'Denim Jacket', 'White Sneakers'],
      reasoning: 'Perfect for weekend errands. Comfortable, casual, and the denim jacket adds a layer for changing temperatures throughout the day.',
      whyNot: 'Denim on denim can be tricky. Make sure the jeans and jacket washes are distinct enough.',
      weatherMatch: 90,
      moodMatch: 98,
      colorHarmony: 91,
      occasion: 'Weekend Casual',
      emoji: '😊',
      gradient: 'bg-gray-700'
    },
  ];

  const toggleSave = (id: number) => {
    if (savedOutfits.includes(id)) {
      setSavedOutfits(savedOutfits.filter(outfitId => outfitId !== id));
    } else {
      setSavedOutfits([...savedOutfits, id]);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-2">
          Your Recommendations
        </h1>
        <p className="text-gray-500">
          Personalized for today's context
        </p>
      </div>

      {/* Context Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3DD9B4]/10 to-[#3DD9B4]/5 border border-white/30">
          <Cloud className="w-6 h-6 mb-2 text-[#3DD9B4]" />
          <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
            Weather
          </p>
          <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
            68°F Cloudy
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/10 to-[#7C6CFF]/5 border border-white/30">
          <Calendar className="w-6 h-6 mb-2 text-[#7C6CFF]" />
          <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
            Occasion
          </p>
          <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
            Work Meeting
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FF6B81]/10 to-[#FF6B81]/5 border border-white/30">
          <Smile className="w-6 h-6 mb-2 text-[#FF6B81]" />
          <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
            Mood
          </p>
          <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
            Confident
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFC98B]/10 to-[#FFC98B]/5 border border-white/30">
          <Palette className="w-6 h-6 mb-2 text-[#FFC98B]" />
          <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>
            Style
          </p>
          <p className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
            Smart Casual
          </p>
        </div>
      </div>

      {/* Outfit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {outfits.map((outfit, i) => (
          <motion.div
            key={outfit.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="group"
          >
            <div className="h-full rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              {/* Top section */}
              <div className={`relative p-8 ${outfit.gradient} text-white`}>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleSave(outfit.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      savedOutfits.includes(outfit.id) ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedOutfits.includes(outfit.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="text-5xl mb-4">{outfit.emoji}</div>

                <h3 className="text-xl font-semibold mb-2">
                  {outfit.name}
                </h3>

                {/* Confidence score */}
                <div className="flex items-center gap-2 mb-2 mt-4">
                  <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${outfit.confidence}%` }}
                      transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {outfit.confidence}%
                  </span>
                </div>

                <p className="text-xs opacity-80 uppercase tracking-wider font-medium">
                  Match Score
                </p>
              </div>

              {/* Details section */}
              <div className="p-6 space-y-5 flex-1 flex flex-col">
                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Outfit Items
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {outfit.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Why This Works
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {outfit.reasoning}
                  </p>
                </div>

                {/* Why Not */}
                {outfit.whyNot && (
                  <div>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
                      ❗ Why Not
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100">
                      {outfit.whyNot}
                    </p>
                  </div>
                )}

                <div className="mt-auto pt-5">
                  <button
                    onClick={() => setSelectedOutfit(outfit)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
        <button
          onClick={() => navigate('/app/chat')}
          className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
        >
          <Sparkles className="w-4 h-4" />
          Continue Chat
        </button>

        {/* Conditionally rendered based on LIVE_MIRROR_ENABLED in a real app, hardcoded false for now */}
        {false && (
          <button
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            Ask Live Stylist
          </button>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOutfit(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 max-w-4xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className={`relative p-12 bg-gradient-to-br ${selectedOutfit.gradient} text-white`}>
              <button
                onClick={() => setSelectedOutfit(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-8xl mb-6">{selectedOutfit.emoji}</div>
              <h2
                className="text-5xl mb-4"
                style={{ fontFamily: 'var(--font-dancing)' }}
              >
                {selectedOutfit.name}
              </h2>

              <div className="flex items-center gap-4">
                <div className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {selectedOutfit.confidence}% Match
                  </span>
                </div>
                <div className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                  <span className="text-lg" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {selectedOutfit.occasion}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Items grid */}
              <div>
                <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
                  Outfit Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedOutfit.items.map((item: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/5 to-[#FF6B81]/5 border border-white/30 text-center">
                      <div className="text-4xl mb-2">👕</div>
                      <p className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
                  AI Stylist Analysis
                </h3>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#7C6CFF]/5 to-[#FF6B81]/5 border border-white/30">
                  <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {selectedOutfit.reasoning}
                  </p>
                </div>
              </div>

              {/* Compatibility scores */}
              <div>
                <h3 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
                  Compatibility Analysis
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Weather Match', score: selectedOutfit.weatherMatch, icon: Cloud, color: '#3DD9B4' },
                    { label: 'Mood Alignment', score: selectedOutfit.moodMatch, icon: Smile, color: '#FF6B81' },
                    { label: 'Color Harmony', score: selectedOutfit.colorHarmony, icon: Palette, color: '#7C6CFF' },
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${metric.color}15` }}
                      >
                        <metric.icon className="w-6 h-6" style={{ color: metric.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                            {metric.label}
                          </span>
                          <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-poppins)', color: metric.color }}>
                            {metric.score}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-foreground/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.score}%` }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => toggleSave(selectedOutfit.id)}
                  className={`flex-1 px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${
                    savedOutfits.includes(selectedOutfit.id)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'border-2 border-[#7C6CFF]/20 hover:border-[#7C6CFF]/40'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <Heart className={savedOutfits.includes(selectedOutfit.id) ? 'fill-current' : ''} />
                  {savedOutfits.includes(selectedOutfit.id) ? 'Saved' : 'Save Look'}
                </button>
                <button
                  className="px-6 py-4 rounded-2xl border-2 border-[#7C6CFF]/20 hover:border-[#7C6CFF]/40 transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={() => navigate('/app/chat')}
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <Sparkles className="w-5 h-5" />
                  Refine with AI
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

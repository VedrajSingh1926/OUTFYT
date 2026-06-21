import { Sparkles, Wand2, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-[#7C6CFF]/20 to-[#FF6B81]/20 blur-2xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#3DD9B4]/20 to-[#FFC98B]/20 blur-3xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main heading with Dancing Script */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1
            className="text-7xl md:text-8xl lg:text-9xl mb-4 bg-gradient-to-r from-[#7C6CFF] via-[#FF6B81] to-[#3DD9B4] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            Your AI Stylist
          </h1>
        </motion.div>

        {/* Subheading with Caveat */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl text-foreground/80 mb-8"
          style={{ fontFamily: 'var(--font-caveat)' }}
        >
          Wardrobe intelligence that understands your style, mood & moment
        </motion.p>

        {/* Description with Poppins */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-foreground/60 max-w-2xl mx-auto mb-12"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          StyleSync AI analyzes your wardrobe, weather, occasion, and mood to recommend
          the perfect outfit every time. Say goodbye to "what should I wear?" stress.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-lg hover:shadow-2xl hover:shadow-[#7C6CFF]/40 transition-all hover:scale-105 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            <Wand2 className="w-5 h-5" />
            Start Styling Now
          </button>
          <button
            className="px-8 py-4 rounded-full border-2 border-[#7C6CFF]/30 text-[#7C6CFF] text-lg hover:bg-[#7C6CFF]/5 transition-all"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Watch Demo
          </button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {[
            { icon: Sparkles, text: 'AI-Powered', color: 'from-[#7C6CFF] to-[#B8A9FF]' },
            { icon: Heart, text: 'Personalized', color: 'from-[#FF6B81] to-[#FFA3B3]' },
            { icon: Wand2, text: 'Intelligent', color: 'from-[#3DD9B4] to-[#7FEED8]' },
          ].map((item, i) => (
            <div
              key={i}
              className={`px-6 py-3 rounded-full bg-gradient-to-r ${item.color} bg-opacity-10 backdrop-blur-sm border border-white/30 flex items-center gap-2`}
            >
              <item.icon className="w-4 h-4 text-white" />
              <span className="text-white text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Floating cards preview */}
        <div className="mt-20 relative">
          <motion.div
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { title: 'Weather Aware', emoji: '🌤️', font: 'var(--font-satisfy)' },
              { title: 'Occasion Perfect', emoji: '🎯', font: 'var(--font-indie)' },
              { title: 'Mood Aligned', emoji: '✨', font: 'var(--font-pacifico)' },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-5xl mb-3">{card.emoji}</div>
                <h3 className="text-xl text-foreground" style={{ fontFamily: card.font }}>
                  {card.title}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

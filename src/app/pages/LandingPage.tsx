import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Sparkles, Brain, Quote } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { Logo } from '../components/Logo';

export function LandingPage() {
  const navigate = useNavigate();

  const testimonials = [
    { name: 'Priya S.', city: 'Jaipur', text: 'OUTFYT feels like ChatGPT for my closet. I upload once and it just knows me.', style: 'var(--font-caveat)' },
    { name: 'Arjun M.', city: 'Delhi', text: 'The weather + occasion combo is scary accurate. No more sweating in the wrong jacket.', style: 'var(--font-poppins)' },
    { name: 'Sneha K.', city: 'Mumbai', text: 'Repeat outfit detection saved me from wearing the same fit three days in a row 😅', style: 'var(--font-satisfy)' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFC] via-[#F5F0FF] to-[#FFF5F7]">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-[#7C6CFF]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm text-foreground/70 hover:text-[#7C6CFF] transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
              Log In
            </button>
            <button onClick={() => navigate('/signup')} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-sm hover:shadow-lg hover:shadow-[#7C6CFF]/30 transition-all" style={{ fontFamily: 'var(--font-poppins)' }}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <Hero />

      <Features />

      <HowItWorks />

      <section className="py-24 px-6 relative overflow-hidden">
        <motion.div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#7C6CFF]/10 blur-3xl" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Brain className="w-12 h-12 mx-auto mb-4 text-[#7C6CFF]" />
            <h2 className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-[#7C6CFF] to-[#3DD9B4] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
              AI Fashion Intelligence
            </h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-poppins)' }}>
              Persistent style memory, wardrobe intelligence, and conversational refinement — like a modern AI operating system for outfits.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Style Memory', desc: 'Learns favorite colors, vibes, and combinations over time.', color: '#7C6CFF' },
              { title: 'Repeat Detection', desc: 'Alerts when you wore a similar look recently.', color: '#FF6B81' },
              { title: 'Context Engine', desc: 'Weather, occasion, mood & notes in every recommendation.', color: '#3DD9B4' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg">
                <Sparkles className="w-8 h-8 mb-4" style={{ color: item.color }} />
                <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-caveat)' }}>{item.title}</h3>
                <p className="text-sm text-foreground/60" style={{ fontFamily: 'var(--font-poppins)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl text-center mb-16 bg-gradient-to-r from-[#FF6B81] to-[#7C6CFF] bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-dancing)' }}>
            Loved by stylish minds
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-8 rounded-3xl bg-white/90 border border-white/50 shadow-xl relative">
                <Quote className="w-8 h-8 text-[#7C6CFF]/30 mb-4" />
                <p className="text-lg mb-6 leading-relaxed" style={{ fontFamily: t.style }}>"{t.text}"</p>
                <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>{t.name}</p>
                <p className="text-xs text-foreground/50" style={{ fontFamily: 'var(--font-poppins)' }}>{t.city}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}

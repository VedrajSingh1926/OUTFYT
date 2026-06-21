import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7C6CFF]/5 via-[#FF6B81]/5 to-[#3DD9B4]/5" />
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#7C6CFF]/20 to-transparent blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF6B81]/20 to-transparent blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/50 shadow-2xl text-center"
        >
          {/* Floating sparkles */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-[#7C6CFF]" />
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#FF6B81]"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-[#3DD9B4]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
              />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-[#7C6CFF] via-[#FF6B81] to-[#3DD9B4] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            Ready to Transform Your Mornings?
          </h2>

          {/* Subheading */}
          <p
            className="text-2xl md:text-3xl text-foreground/70 mb-8"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Join thousands who've said goodbye to outfit anxiety
          </p>

          {/* Description */}
          <p
            className="text-lg text-foreground/60 max-w-2xl mx-auto mb-10"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Start your 14-day free trial. No credit card required.
            Cancel anytime. Experience AI styling that actually gets you.
          </p>

          {/* CTA Button */}
          <motion.button
            onClick={() => navigate('/signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-xl shadow-2xl shadow-[#7C6CFF]/40 hover:shadow-[#7C6CFF]/60 transition-all"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Start Styling Now
            <ArrowRight className="w-6 h-6" />
          </motion.button>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap gap-6 justify-center items-center opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#3DD9B4]" />
              <span className="text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                10,000+ Happy Users
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FFC98B]" />
              <span className="text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                4.9★ Average Rating
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FF6B81]" />
              <span className="text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
                Privacy Focused
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

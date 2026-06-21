import { Palette, Cloud, Calendar, Smile, Sparkles, Image } from 'lucide-react';
import { motion } from 'motion/react';

export function Features() {
  const features = [
    {
      icon: Image,
      title: 'Wardrobe Analysis',
      description: 'Upload your clothes once. Our AI catalogs everything intelligently.',
      gradient: 'from-[#7C6CFF] to-[#B8A9FF]',
      titleFont: 'var(--font-dancing)',
    },
    {
      icon: Cloud,
      title: 'Weather Intelligence',
      description: 'Real-time weather integration ensures comfort meets style.',
      gradient: 'from-[#3DD9B4] to-[#7FEED8]',
      titleFont: 'var(--font-pacifico)',
    },
    {
      icon: Calendar,
      title: 'Occasion Perfect',
      description: 'From interviews to parties, get context-aware recommendations.',
      gradient: 'from-[#FF6B81] to-[#FFA3B3]',
      titleFont: 'var(--font-caveat)',
    },
    {
      icon: Smile,
      title: 'Mood Understanding',
      description: 'Feel confident, relaxed, or bold - your outfit reflects your vibe.',
      gradient: 'from-[#FFC98B] to-[#FFE0B8]',
      titleFont: 'var(--font-satisfy)',
    },
    {
      icon: Palette,
      title: 'Color Harmony',
      description: 'Optional skin tone analysis for perfectly coordinated colors.',
      gradient: 'from-[#FF6B81] to-[#7C6CFF]',
      titleFont: 'var(--font-indie)',
    },
    {
      icon: Sparkles,
      title: 'Style Learning',
      description: 'The more you use it, the better it understands your preferences.',
      gradient: 'from-[#3DD9B4] to-[#7C6CFF]',
      titleFont: 'var(--font-cookie)',
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            Intelligent Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-foreground/60"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Everything you need for stress-free outfit decisions
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="h-full p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl transition-all">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3
                  className="text-2xl mb-3 text-foreground"
                  style={{ fontFamily: feature.titleFont }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-foreground/60 leading-relaxed"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

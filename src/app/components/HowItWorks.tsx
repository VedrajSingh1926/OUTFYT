import { Upload, Sparkles, Heart, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload Your Wardrobe',
      description: 'Take photos of your clothes. Our AI identifies, categorizes, and organizes everything.',
      color: '#7C6CFF',
      titleFont: 'var(--font-satisfy)',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'Set Your Context',
      description: 'Tell us the occasion, check the weather, and share how you feel today.',
      color: '#3DD9B4',
      titleFont: 'var(--font-pacifico)',
    },
    {
      number: '03',
      icon: Heart,
      title: 'Get AI Recommendations',
      description: 'Receive 3 perfectly curated outfits with confidence scores and styling tips.',
      color: '#FF6B81',
      titleFont: 'var(--font-indie)',
    },
    {
      number: '04',
      icon: Shirt,
      title: 'Refine & Rock It',
      description: 'Chat with AI to adjust recommendations. Save favorites. Look amazing.',
      color: '#FFC98B',
      titleFont: 'var(--font-cookie)',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-br from-white/50 to-[#F5F0FF]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl mb-4 bg-gradient-to-r from-[#FF6B81] via-[#7C6CFF] to-[#3DD9B4] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-dancing)' }}
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl text-foreground/60"
            style={{ fontFamily: 'var(--font-caveat)' }}
          >
            Four simple steps to outfit perfection
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-current to-transparent opacity-20 -z-10" style={{ color: step.color }} />
              )}

              <div className="relative">
                {/* Step number */}
                <div
                  className="text-7xl opacity-10 absolute -top-6 -left-2"
                  style={{ fontFamily: 'var(--font-dancing)', color: step.color }}
                >
                  {step.number}
                </div>

                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl transition-all group hover:-translate-y-2">
                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl mb-3 text-foreground"
                    style={{ fontFamily: step.titleFont }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-foreground/60 leading-relaxed"
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#7C6CFF]/10 via-[#FF6B81]/10 to-[#3DD9B4]/10 border border-white/30">
            <Sparkles className="w-5 h-5 text-[#7C6CFF]" />
            <span className="text-lg" style={{ fontFamily: 'var(--font-caveat)' }}>
              Takes less than 5 minutes to get started
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

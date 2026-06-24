import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizes = {
  sm: { icon: 'w-6 h-6', text: 'text-lg', spark: 'w-2 h-2', gap: 'gap-2' },
  md: { icon: 'w-10 h-10', text: 'text-2xl', spark: 'w-3 h-3', gap: 'gap-3' },
  lg: { icon: 'w-14 h-14', text: 'text-3xl', spark: 'w-4 h-4', gap: 'gap-3.5' },
  xl: { icon: 'w-20 h-20', text: 'text-5xl', spark: 'w-6 h-6', gap: 'gap-4' },
};

/**
 * The core geometric AI fashion symbol.
 * A sharp, minimal prism/spark representing AI precision and modern SaaS elegance.
 */
function LogoSymbol({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="prismGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="prismGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC98B" stopOpacity="1" />
          <stop offset="100%" stopColor="#FF6B81" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* Outer AI Spark/Prism */}
      <path 
        d="M50 5 L55 35 L85 40 L60 55 L70 85 L50 65 L30 85 L40 55 L15 40 L45 35 Z" 
        fill="url(#prismGrad1)" 
        stroke="url(#prismGrad2)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Inner Intelligence Core */}
      <circle cx="50" cy="48" r="8" fill="#7C6CFF" />
      <circle cx="50" cy="48" r="4" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * 1. Main Logo
 */
export function LogoMain({ size = 'md', className = '', showText = true }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {/* Icon Container */}
      <div className={`relative ${s.icon} flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E1E2A] to-[#3B3B4F] shadow-xl overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7C6CFF]/20 to-[#FF6B81]/20 mix-blend-overlay" />
        <LogoSymbol className="w-[70%] h-[70%] relative z-10" />
        
        {/* Subtle interactive hover sparkle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          whileHover={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1 right-1"
        >
          <Sparkles className={`${s.spark} text-[#FFC98B]`} />
        </motion.div>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div
            className={`${s.text} font-extrabold tracking-tight text-foreground`}
            style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
          >
            OUTFYT
          </div>
          {size !== 'sm' && (
            <div className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-foreground/40 mt-[-2px]" style={{ fontFamily: 'var(--font-poppins)' }}>
              Intelligence
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 2. Compact Sidebar Logo
 */
export function LogoCompact({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1E2A] to-[#3B3B4F] shadow-lg overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C6CFF]/20 to-transparent mix-blend-overlay pointer-events-none" />
      <LogoSymbol className="w-[65%] h-[65%] relative z-10" />
    </div>
  );
}

/**
 * 3. App Icon / Favicon (SVG for manifest.json and favicon.ico generation)
 */
export function LogoIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1E2A" />
          <stop offset="100%" stopColor="#3B3B4F" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#bg-grad-dark)" />
      <LogoSymbol className="w-[60%] h-[60%] translate-x-[20%] translate-y-[20%] origin-center" />
    </svg>
  );
}

/**
 * 4. Animated Loader Mark
 */
export function LogoLoader({ className = '' }: { className?: string }) {
  return (
    <motion.div 
      className={`relative w-12 h-12 flex items-center justify-center ${className}`}
      animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 rounded-2xl bg-[#7C6CFF] opacity-30 blur-xl animate-pulse" />
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#1E1E2A] to-[#3B3B4F] flex items-center justify-center shadow-xl border border-white/10">
         <LogoSymbol className="w-[65%] h-[65%]" />
      </div>
    </motion.div>
  );
}

// For backwards compatibility across the app
export function Logo(props: LogoProps) {
  return <LogoMain {...props} />;
}

import { Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-lavender/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl" style={{ fontFamily: 'var(--font-sacramento)' }}>
            StyleSync AI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8" style={{ fontFamily: 'var(--font-poppins)' }}>
          <a href="#features" className="text-sm text-foreground/70 hover:text-[#7C6CFF] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-[#7C6CFF] transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-sm text-foreground/70 hover:text-[#7C6CFF] transition-colors">
            About
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-5 py-2 text-sm text-foreground/70 hover:text-[#7C6CFF] transition-colors"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Log In
          </button>
          <button
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white text-sm hover:shadow-lg hover:shadow-[#7C6CFF]/30 transition-all"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}

import { Sparkles, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-gradient-to-br from-white/80 to-[#F5F0FF]/80 backdrop-blur-sm border-t border-[#7C6CFF]/10">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl" style={{ fontFamily: 'var(--font-sacramento)' }}>
                OUTFYT
              </span>
            </div>
            <p
              className="text-foreground/60 leading-relaxed"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Your intelligent wardrobe assistant. Never wonder what to wear again.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4
              className="text-lg mb-4 text-foreground"
              style={{ fontFamily: 'var(--font-caveat)' }}
            >
              Product
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              <li>
                <a href="#features" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              className="text-lg mb-4 text-foreground"
              style={{ fontFamily: 'var(--font-satisfy)' }}
            >
              Company
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              <li>
                <a href="#about" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-lg mb-4 text-foreground"
              style={{ fontFamily: 'var(--font-indie)' }}
            >
              Legal
            </h4>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              <li>
                <a href="#privacy" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#cookies" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#ai-disclaimer" className="text-sm text-foreground/60 hover:text-[#7C6CFF] transition-colors">
                  AI Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#7C6CFF]/20 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <p
            className="text-sm text-foreground/50"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            © 2026 OUTFYT. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, href: '#', color: '#FF6B81' },
              { icon: Twitter, href: '#', color: '#7C6CFF' },
              { icon: Linkedin, href: '#', color: '#3DD9B4' },
              { icon: Mail, href: '#', color: '#FFC98B' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all group"
              >
                <social.icon
                  className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors"
                  style={{ color: social.color }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Final tagline */}
        <div className="mt-8 text-center">
          <p
            className="text-lg text-foreground/40"
            style={{ fontFamily: 'var(--font-cookie)' }}
          >
            Made with love for fashion-conscious people everywhere ✨
          </p>
        </div>
      </div>
    </footer>
  );
}

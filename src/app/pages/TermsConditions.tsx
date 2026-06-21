import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function TermsConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFC] via-[#F5F0FF] to-[#FFF5F7] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-foreground/60 hover:text-[#7C6CFF] transition-colors"
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="p-12 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C6CFF] to-[#FF6B81] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1
              className="text-5xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-dancing)' }}
            >
              Terms & Conditions
            </h1>
          </div>

          <div className="prose prose-lg max-w-none" style={{ fontFamily: 'var(--font-poppins)' }}>
            <p className="text-foreground/60 mb-8">Last updated: May 22, 2026</p>

            <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
              Agreement to Terms
            </h2>
            <p className="mb-6 text-foreground/70">
              By using StyleSync AI, you agree to these terms and conditions. Please read them carefully.
            </p>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              Service Description
            </h2>
            <p className="mb-6 text-foreground/70">
              StyleSync AI provides AI-powered outfit recommendations based on your wardrobe, weather, occasion, and personal preferences. Our service is provided "as is" and we make no guarantees about fashion outcomes.
            </p>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              User Responsibilities
            </h2>
            <ul className="mb-6 text-foreground/70 space-y-2">
              <li>Provide accurate information</li>
              <li>Keep your account secure</li>
              <li>Use the service legally and ethically</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              AI Disclaimer
            </h2>
            <p className="mb-6 text-foreground/70">
              StyleSync AI uses artificial intelligence to generate outfit recommendations. While we strive for accuracy, AI suggestions are computational predictions and should be used as styling guidance, not absolute fashion rules.
            </p>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              Contact
            </h2>
            <p className="text-foreground/70">
              Questions? Reach us at legal@stylesyncai.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

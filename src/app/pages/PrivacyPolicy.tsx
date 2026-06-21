import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-lg max-w-none" style={{ fontFamily: 'var(--font-poppins)' }}>
            <p className="text-foreground/60 mb-8">Last updated: May 22, 2026</p>

            <h2 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-caveat)' }}>
              Your Privacy Matters
            </h2>
            <p className="mb-6 text-foreground/70">
              At StyleSync AI, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              Information We Collect
            </h2>
            <p className="mb-4 text-foreground/70">
              We collect information you provide directly, including:
            </p>
            <ul className="mb-6 text-foreground/70 space-y-2">
              <li>Account information (name, email)</li>
              <li>Wardrobe photos and clothing data</li>
              <li>Optional selfie for color analysis</li>
              <li>Style preferences and settings</li>
              <li>Location data for weather integration</li>
            </ul>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              How We Use Your Data
            </h2>
            <p className="mb-4 text-foreground/70">
              Your data powers your personalized AI styling experience. We use it to:
            </p>
            <ul className="mb-6 text-foreground/70 space-y-2">
              <li>Generate outfit recommendations</li>
              <li>Improve AI accuracy over time</li>
              <li>Provide weather-appropriate suggestions</li>
              <li>Analyze color compatibility</li>
            </ul>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              Data Security
            </h2>
            <p className="mb-6 text-foreground/70">
              We use industry-standard encryption and security measures. Your photos and personal data are never shared with third parties without your explicit consent.
            </p>

            <h2 className="text-2xl mb-4 mt-8" style={{ fontFamily: 'var(--font-caveat)' }}>
              Contact Us
            </h2>
            <p className="text-foreground/70">
              Questions about privacy? Contact us at privacy@stylesyncai.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

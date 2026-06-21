import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ChevronRight, User, Mail, Plus } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, name: string) => Promise<void>;
}

export function GoogleOAuthModal({ isOpen, onClose, onSuccess }: GoogleOAuthModalProps) {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockAccounts = [
    { email: 'stylist@stylesync.ai', name: 'StyleSync AI Stylist Demo', avatar: '✨' },
    { email: 'traveler@stylesync.ai', name: 'StyleSync Traveler Demo', avatar: '✈️' },
  ];

  const handleSelectAccount = (email: string, name: string) => {
    setSelectedEmail(email);
    setCustomEmail(email);
    setCustomName(name);
    setShowCustomForm(false);
  };

  const handleAgreeAndContinue = async () => {
    const emailToUse = showCustomForm ? customEmail : (selectedEmail || 'stylist@stylesync.ai');
    const nameToUse = showCustomForm ? customName : (mockAccounts.find(a => a.email === emailToUse)?.name || 'StyleSync User');

    if (!emailToUse) return;

    setLoading(true);
    try {
      await onSuccess(emailToUse, nameToUse || emailToUse.split('@')[0]);
      onClose();
    } catch {
      // toast/error should be handled by the parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-semibold text-gray-800" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Choose an account
                </h3>
                <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                  to continue to <span className="font-semibold text-[#7C6CFF]">StyleSync AI</span>
                </p>
              </div>

              {/* Account List */}
              <div className="space-y-2">
                {mockAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc.email, acc.name)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 text-left transition-all ${
                      selectedEmail === acc.email && !showCustomForm
                        ? 'border-[#7C6CFF] bg-[#7C6CFF]/5'
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg border border-gray-100">
                        {acc.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {acc.name}
                        </p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {acc.email}
                        </p>
                      </div>
                    </div>
                    {selectedEmail === acc.email && !showCustomForm && (
                      <div className="w-5 h-5 rounded-full bg-[#7C6CFF] flex items-center justify-center text-white text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                ))}

                {/* Custom account button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomForm(true);
                    setSelectedEmail(null);
                  }}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 text-left transition-all ${
                    showCustomForm
                      ? 'border-[#7C6CFF] bg-[#7C6CFF]/5'
                      : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 text-gray-500">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-700" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Use another account
                      </p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Sign in with a different email
                      </p>
                    </div>
                  </div>
                  {showCustomForm && (
                    <div className="w-5 h-5 rounded-full bg-[#7C6CFF] flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              </div>

              {/* Custom Form fields */}
              {showCustomForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3"
                >
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Alexa Carter"
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#7C6CFF] transition-all"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Google Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="alexa@gmail.com"
                        className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:border-[#7C6CFF] transition-all"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Permissions info */}
              <div className="p-4 rounded-2xl bg-[#7C6CFF]/5 border border-[#7C6CFF]/10 space-y-3">
                <div className="flex gap-2.5 items-start">
                  <Shield className="w-5 h-5 text-[#7C6CFF] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide" style={{ fontFamily: 'var(--font-poppins)' }}>
                      StyleSync AI Requests Access:
                    </h4>
                    <ul className="text-xs text-gray-500 mt-1.5 space-y-1.5 list-disc list-inside" style={{ fontFamily: 'var(--font-poppins)' }}>
                      <li>View your email address (used to identify you)</li>
                      <li>View your name and profile picture</li>
                      <li>Manage and sync your virtual wardrobe wardrobe preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAgreeAndContinue}
                disabled={loading || (!showCustomForm && !selectedEmail) || (showCustomForm && !customEmail)}
                className="flex-1 py-3 text-sm font-semibold rounded-xl bg-[#7C6CFF] hover:bg-[#6858E0] text-white transition-all disabled:opacity-50 shadow-md shadow-[#7C6CFF]/10 flex items-center justify-center gap-1.5"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {loading ? 'Connecting...' : 'Agree & Continue'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

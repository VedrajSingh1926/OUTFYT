import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { LogoMain } from '../components/Logo';

export function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-[#FAFAFC] relative">
        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Logo */}
          <div className="mb-8">
            <LogoMain size="md" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1
              className="text-3xl md:text-4xl mb-2 font-bold text-foreground"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Welcome Back
            </h1>
            <p className="text-foreground/60 mb-8 font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
              Sign in to continue to your AI stylist.
            </p>

            {/* Loading State Skeleton */}
            <ClerkLoading>
              <div className="w-full flex flex-col gap-4 animate-pulse">
                <div className="h-12 w-full bg-[#7C6CFF]/5 rounded-2xl border border-[#7C6CFF]/10 flex items-center justify-center">
                   <Loader2 className="w-5 h-5 text-[#7C6CFF]/40 animate-spin" />
                </div>
                <div className="flex items-center gap-4 my-2">
                  <div className="h-px bg-border flex-1" />
                  <div className="h-4 w-8 bg-border/40 rounded" />
                  <div className="h-px bg-border flex-1" />
                </div>
                <div className="h-20 w-full bg-border/20 rounded-2xl" />
                <div className="h-20 w-full bg-border/20 rounded-2xl" />
                <div className="h-12 w-full bg-border/20 rounded-2xl mt-4" />
              </div>
            </ClerkLoading>

            {/* Clerk SignIn Component */}
            <ClerkLoaded>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.4 }}
                className="flex justify-center w-full"
              >
                 <SignIn 
                   signUpUrl="/signup" 
                   fallbackRedirectUrl="/app"
                   appearance={{
                     layout: {
                       socialButtonsPlacement: 'top',
                       socialButtonsVariant: 'blockButton',
                       animations: true,
                     },
                     elements: {
                       card: 'shadow-none bg-transparent w-full p-0 m-0',
                       header: 'hidden',
                       socialButtonsBlockButton: 'w-full py-3.5 rounded-2xl bg-white border-2 border-transparent shadow-sm hover:border-[#7C6CFF]/30 hover:shadow-md transition-all duration-300 text-sm font-semibold text-foreground relative overflow-hidden group',
                       socialButtonsBlockButtonText: 'font-semibold',
                       dividerRow: 'my-6',
                       dividerText: 'text-foreground/40 font-medium text-xs uppercase tracking-wider',
                       dividerLine: 'bg-border/60',
                       formFieldInput: 'w-full rounded-2xl bg-white border border-border/80 focus:border-[#7C6CFF] focus:outline-none focus:ring-4 focus:ring-[#7C6CFF]/10 transition-all py-3.5 px-4 text-foreground font-medium shadow-sm',
                       formFieldLabel: 'text-sm font-semibold text-foreground/80 mb-2',
                       formFieldWarningText: 'text-xs text-[#FF6B81] mt-1',
                       formFieldErrorText: 'text-xs text-[#FF6B81] mt-1',
                       formButtonPrimary: 'w-full py-3.5 rounded-2xl bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold text-base shadow-lg shadow-foreground/20 mt-2',
                       footerAction: 'mt-8',
                       footerActionText: 'text-foreground/60 font-medium',
                       footerActionLink: 'text-[#7C6CFF] font-semibold hover:text-[#5B4AE0] transition-colors',
                       identityPreviewText: 'text-foreground font-medium',
                       identityPreviewEditButton: 'text-[#7C6CFF] hover:text-[#5B4AE0]',
                       formResendCodeLink: 'text-[#7C6CFF] hover:text-[#5B4AE0] font-medium',
                       otpCodeFieldInput: 'w-12 h-14 text-xl font-bold rounded-xl border border-border/80 focus:border-[#7C6CFF] focus:ring-4 focus:ring-[#7C6CFF]/10 text-center mx-1 transition-all shadow-sm',
                     }
                   }}
                 />
              </motion.div>
            </ClerkLoaded>
          </motion.div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden md:flex flex-col justify-center items-center p-12 bg-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#7C6CFF]/20 to-[#FF6B81]/10 blur-3xl -translate-y-1/2 translate-x-1/3"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="relative z-10 text-background text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 rounded-[2rem] bg-background/5 border border-background/10 backdrop-blur-md flex items-center justify-center shadow-2xl p-4">
             <LogoMain size="xl" showText={false} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Intelligent Styling
          </h2>
          <p className="text-lg opacity-80 font-medium leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
            Experience the future of fashion. Your wardrobe, perfectly curated and optimized by advanced AI.
          </p>
        </div>
      </div>
    </div>
  );
}

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from './components/ui/sonner';
import { ShieldAlert } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Clerk Authentication Setup
 * 
 * 1. Clerk Key: Place your Clerk publishable key in a `.env` file at the root of the project:
 *    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
 * 
 * 2. Google OAuth: Configure Google authentication in your Clerk Dashboard under 
 *    User & Authentication -> Social Connections. Enable Google and configure the 
 *    client ID and secret from your Google Cloud Console.
 * 
 * 3. Safe Deployment: 
 *    - Never commit your `.env` file containing production keys.
 *    - In your hosting provider (Vercel, Netlify, Render, etc.), set the 
 *      VITE_CLERK_PUBLISHABLE_KEY environment variable in their project settings.
 */
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function AuthError() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-16 h-16 text-[#FF6B81] mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
        Authentication configuration missing.
      </h1>
      <p className="text-foreground/60 max-w-md" style={{ fontFamily: 'var(--font-poppins)' }}>
        Please add your Clerk Publishable Key to your .env file as <code className="bg-[#7C6CFF]/10 text-[#7C6CFF] px-2 py-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code>.
      </p>
    </div>
  );
}

export default function App() {
  // Prevent white screen crash by gracefully handling missing keys
  if (!PUBLISHABLE_KEY) {
    return <AuthError />;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ErrorBoundary>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </ErrorBoundary>
    </ClerkProvider>
  );
}

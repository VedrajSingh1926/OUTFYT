import { Navigate, useLocation } from 'react-router';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '@/context/AuthContext';
import { isOnboardingPaused } from '@/lib/onboardingStorage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded: clerkLoaded, isSignedIn } = useClerkAuth();
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!clerkLoaded || (isSignedIn && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAFC] via-[#F5F0FF] to-[#FFF5F7]">
        <div className="w-10 h-10 rounded-full border-2 border-[#7C6CFF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const onboardingComplete = user?.onboardingComplete === true;

  if (onboardingComplete && location.pathname === '/onboarding') {
    return <Navigate to="/app/studio" replace />;
  }

  const canAccessApp = onboardingComplete || isOnboardingPaused();

  if (!canAccessApp && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

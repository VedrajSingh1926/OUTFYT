import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api, type User } from '@/lib/api';
import { useUser, useClerk } from '@clerk/clerk-react';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { session } = useClerk();
  const refreshUser = useCallback(async () => {
    if (!clerkUser) {
      setUser(null);
      localStorage.removeItem('stylesync_token');
      localStorage.removeItem('stylesync_user');
      return;
    }
    try {
      // Sync Clerk user with backend by passing the real JWT token
      let token = null;
      if (session) {
        token = await session.getToken();
      }
      if (token) {
        localStorage.setItem('stylesync_token', token);
      }
      
      const { user: u } = await api.user.profile();
      setUser(u);
      localStorage.setItem('stylesync_user', JSON.stringify(u));
    } catch {
      // fallback if profile fails
      const fallbackUser: User = { id: clerkUser.id, email: clerkUser.primaryEmailAddress?.emailAddress || '', name: clerkUser.fullName || '' };
      setUser(fallbackUser);
    }
  }, [clerkUser, session]);

  useEffect(() => {
    if (!isLoaded) return;
    refreshUser().finally(() => setLoading(false));
  }, [isLoaded, refreshUser]);

  const logout = () => {
    signOut();
    localStorage.removeItem('stylesync_token');
    localStorage.removeItem('stylesync_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

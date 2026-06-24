import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { api, type User } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // Mock an auth token so backend recognizes we bypass login
      localStorage.setItem('stylesync_token', 'demo_token');
      
      const { user: u } = await api.user.profile();
      setUser(u);
      localStorage.setItem('stylesync_user', JSON.stringify(u));
    } catch {
      const fallbackUser: User = { id: 'demo_user', email: 'user@clerk.com', name: 'Demo User' };
      setUser(fallbackUser);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const logout = () => {
    // No-op for demo user mode
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

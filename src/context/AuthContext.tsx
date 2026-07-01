import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  name: string;
  phone: string;
  countryCode: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'imbet11_auth_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Mock session persistence only. This has zero real security value -
  // it exists purely so a demo/reviewer doesn't get logged out on every
  // page refresh. There is no backend validating credentials yet.
  // Replace login()/logout() with real API calls (e.g. Supabase Auth,
  // or your own service) once this template is wired to a live backend.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

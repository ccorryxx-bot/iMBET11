import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser {
  name: string;
  phone: string;
  countryCode: string;
  balance: number;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  providerToken: string | null;
  login: (authUser: Omit<AuthUser, 'balance'>, providerToken: string) => void;
  logout: () => void;
  deposit: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'imbet11_auth_session';
const TOKEN_KEY = 'imbet11_provider_token';
const STARTING_BALANCE = 0;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [providerToken, setProviderToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    if (stored && storedToken) {
      try {
        const parsed = JSON.parse(stored);
        setUser({ balance: STARTING_BALANCE, ...parsed });
        setProviderToken(storedToken);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const persist = (next: AuthUser | null, token: string | null = null) => {
    setUser(next);
    setProviderToken(token);
    if (next && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  };

  const login = (authUser: Omit<AuthUser, 'balance'>, token: string) => {
    persist({ ...authUser, balance: STARTING_BALANCE }, token);
  };

  const logout = () => persist(null);

  const deposit = (amount: number) => {
    if (!user || !Number.isFinite(amount) || amount <= 0) return;
    persist({ ...user, balance: user.balance + amount }, providerToken);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user && !!providerToken,
        user,
        providerToken,
        login,
        logout,
        deposit,
      }}
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

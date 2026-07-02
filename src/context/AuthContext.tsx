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
  login: (user: Omit<AuthUser, 'balance'>) => void;
  logout: () => void;
  deposit: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'imbet11_auth_session';

// New accounts start at ฿0 - not a pre-loaded demo balance. Real
// betting/fintech products never auto-credit a signup balance without
// an explicit, compliance-reviewed promo flow (bonus abuse / AML
// optics). If the product wants a signup bonus later, that should be
// its own deliberate feature, not a silent default. Bump this only
// for local demo purposes.
const STARTING_BALANCE = 0;

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
        const parsed = JSON.parse(stored);
        // Defensive default: sessions saved before `balance` existed
        // won't have the field. Without this, old sessions would load
        // with balance = undefined and break arithmetic/formatting.
        setUser({ balance: STARTING_BALANCE, ...parsed });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (authUser: Omit<AuthUser, 'balance'>) => {
    persist({ ...authUser, balance: STARTING_BALANCE });
  };

  const logout = () => {
    persist(null);
  };

  // MOCK: updates the balance client-side only. Nothing here verifies a
  // deposit actually happened - a user can open devtools, edit
  // localStorage, and set any balance they want. Do NOT ship this to
  // production before deposits are confirmed server-side: payment
  // webhook -> DB write -> client re-fetches balance from the server.
  // The client must never be the source of truth for money.
  const deposit = (amount: number) => {
    if (!user || !Number.isFinite(amount) || amount <= 0) return;
    persist({ ...user, balance: user.balance + amount });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, deposit }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

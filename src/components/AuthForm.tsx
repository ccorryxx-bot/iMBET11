import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'register';
}

// Supported country codes for the phone field. "+68" (originally
// requested) is not a valid ITU-T E.164 code, so it was replaced with
// +66 (Thailand) - see commit history. +86 (China) added on request.
// Phone digit-count validation below accepts 7-12 digits, which covers
// all three (MM mobile ~9, TH mobile ~9, CN mobile 11) without change.
const countries = [
  { code: '+95', flag: '🇲🇲' },
  { code: '+66', flag: '🇹🇭' },
  { code: '+86', flag: '🇨🇳' },
];

export default function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRegister = mode === 'register';

  const validate = () => {
    const next: Record<string, string> = {};
    if (isRegister && name.trim().length < 2) {
      next.name = 'Name must be at least 2 characters';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 12) {
      next.phone = 'Enter a valid phone number';
    }
    if (password.length < 6) {
      next.password = 'Password must be at least 6 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // MOCK AUTH: there is no backend to verify credentials against yet,
    // so any well-formed input is accepted and turned into a local
    // session. Replace this block with a real API call (e.g. Supabase
    // Auth) when this template is wired to a live backend.
    login({
      name: isRegister ? name.trim() : name.trim() || 'Player',
      phone: `${countryCode}${phone.replace(/\D/g, '')}`,
      countryCode,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Back button - returns to Home. Using an explicit route (not
          navigate(-1)/browser history) on purpose: this screen can be
          reached via a direct link/bookmark with no history stack, and
          BottomNav is intentionally hidden here, so history-based back
          could otherwise strand the user or exit the app entirely. */}
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-surface/80 text-text-primary backdrop-blur-sm active:scale-95 transition-transform"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Ghost watermark - matches the pattern already used on Home/Profile */}
      <motion.div
        className="absolute -top-10 -left-16 text-[10rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none -rotate-12"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        {isRegister ? 'JOIN' : 'LOGIN'}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <h1 className="text-2xl font-semibold text-text-primary">
          {isRegister ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          {isRegister ? 'Join iMBET11 in under a minute' : 'Log in to continue playing'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {isRegister && (
            <div>
              <label className="text-text-secondary text-xs">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent border-b border-text-primary/15 focus:border-accent-gold outline-none py-2 text-text-primary placeholder:text-text-muted transition-colors"
              />
              {errors.name && <p className="text-status-error text-xs mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="text-text-secondary text-xs">Phone Number</label>
            <div className="flex items-center border-b border-text-primary/15 focus-within:border-accent-gold transition-colors">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-text-primary outline-none py-2 pr-2"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code} className="bg-brand-bg text-text-primary">
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9xx xxx xxx"
                className="flex-1 bg-transparent outline-none py-2 pl-2 text-text-primary placeholder:text-text-muted"
              />
            </div>
            {errors.phone && <p className="text-status-error text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-text-secondary text-xs">Password</label>
            <div className="flex items-center border-b border-text-primary/15 focus-within:border-accent-gold transition-colors">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none py-2 text-text-primary placeholder:text-text-muted"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-text-muted">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-status-error text-xs mt-1">{errors.password}</p>}
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-full bg-accent-gold text-text-dark font-medium mt-2"
            whileTap={{ scale: 0.98 }}
          >
            {isRegister ? 'Create account' : 'Log in'}
          </motion.button>
        </form>

        <p className="text-center text-text-secondary text-sm mt-6">
          {isRegister ? (
            <>Already have an account? <Link to="/login" className="text-accent-gold">Log in</Link></>
          ) : (
            <>Don't have an account? <Link to="/register" className="text-accent-gold">Register</Link></>
          )}
        </p>
      </motion.div>
    </div>
  );
}

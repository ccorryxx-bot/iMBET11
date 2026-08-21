import { useEffect, useRef, useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const countries = [
  { code: '+95', flag: 'MM' },
  { code: '+66', flag: 'TH' },
  { code: '+86', flag: 'CN' },
];

function createCaptcha() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState(countries[0].code);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [captchaCode, setCaptchaCode] = useState(createCaptcha);
  const [captchaValue, setCaptchaValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isRegister = mode === 'register';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#e5e7eb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'bold 22px monospace';
    context.fillStyle = '#17211d';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(captchaCode, canvas.width / 2, canvas.height / 2);
    context.strokeStyle = '#b08a2e';
    context.beginPath();
    context.moveTo(8, 12);
    context.lineTo(138, 34);
    context.stroke();
  }, [captchaCode]);

  const refreshCaptcha = () => {
    setCaptchaCode(createCaptcha());
    setCaptchaValue('');
    setErrors((current) => ({ ...current, captcha: '' }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) {
      next.name = isRegister ? 'Name must be at least 2 characters' : 'Enter your UltraSpin username';
    }
    if (isRegister) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 12) next.phone = 'Enter a valid phone number';
    }
    if (password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!isRegister && captchaValue.trim() !== captchaCode) next.captcha = 'Captcha does not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      setErrors({ form: 'Registration is not connected to UltraSpin yet. Use an existing provider account to log in.' });
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const response = await fetch('/api/ultraspin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name.trim(),
          password,
          captcha_value: captchaValue.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || typeof data.token !== 'string') {
        throw new Error(data.error || 'UltraSpin login failed');
      }

      const providerUser = data.user || {};
      login(
        {
          name: String(providerUser.username || providerUser.name || name.trim()),
          phone: String(providerUser.phone || ''),
          countryCode,
        },
        data.token,
      );
      navigate('/');
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'UltraSpin login failed' });
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden">
      <button
        type="button"
        onClick={() => navigate('/')}
        aria-label="Back to home"
        className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-accent-gold text-text-dark shadow-md active:scale-95 transition-transform"
      >
        <ArrowLeft size={18} />
      </button>

      <motion.div
        className="absolute -top-10 -left-16 text-[10rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none -rotate-12"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        {isRegister ? 'JOIN' : 'LOGIN'}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <h1 className="text-2xl font-semibold text-text-primary">{isRegister ? 'Create account' : 'Welcome back'}</h1>
        <p className="text-text-secondary text-sm mt-1">
          {isRegister ? 'Join iMBET11 in under a minute' : 'Log in with your UltraSpin provider account'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-text-secondary text-xs">{isRegister ? 'Name' : 'UltraSpin Username'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="username"
              placeholder={isRegister ? 'Your name' : 'Username'}
              className="w-full bg-transparent border-b border-text-primary/15 focus:border-accent-gold outline-none py-2 text-text-primary placeholder:text-text-muted transition-colors"
            />
            {errors.name && <p className="text-status-error text-xs mt-1">{errors.name}</p>}
          </div>

          {isRegister && (
            <div>
              <label className="text-text-secondary text-xs">Phone Number</label>
              <div className="flex items-center border-b border-text-primary/15 focus-within:border-accent-gold transition-colors">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent text-text-primary outline-none py-2 pr-2"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code} className="bg-brand-bg text-text-primary">
                      {country.flag} {country.code}
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
          )}

          <div>
            <label className="text-text-secondary text-xs">Password</label>
            <div className="flex items-center border-b border-text-primary/15 focus-within:border-accent-gold transition-colors">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="flex-1 bg-transparent outline-none py-2 text-text-primary placeholder:text-text-muted"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-text-muted" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-status-error text-xs mt-1">{errors.password}</p>}
          </div>

          {!isRegister && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-text-secondary text-xs">Captcha</label>
                <button type="button" onClick={refreshCaptcha} className="text-text-muted" aria-label="Refresh captcha">
                  <RefreshCw size={15} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <canvas ref={canvasRef} width={146} height={46} className="rounded-md" aria-label={`Captcha ${captchaCode}`} />
                <input
                  type="text"
                  value={captchaValue}
                  onChange={(e) => setCaptchaValue(e.target.value)}
                  inputMode="numeric"
                  placeholder="Enter code"
                  className="min-w-0 flex-1 bg-transparent border-b border-text-primary/15 focus:border-accent-gold outline-none py-2 text-text-primary placeholder:text-text-muted"
                />
              </div>
              {errors.captcha && <p className="text-status-error text-xs mt-1">{errors.captcha}</p>}
            </div>
          )}

          {errors.form && <p className="text-status-error text-xs">{errors.form}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-accent-gold text-text-dark font-medium mt-2 disabled:opacity-60"
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Connecting…' : isRegister ? 'Create account' : 'Log in'}
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

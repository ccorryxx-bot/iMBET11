import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import GameCard from '../components/GameCard';
import PromoBanner from '../components/PromoBanner';
import { useAuth } from '../context/AuthContext';

interface ProviderGame {
  id: number;
  uid: string;
  game_name: string;
  game_image: string;
  image: string;
  game_type: string;
  game_provider: string;
  game_uuid: string;
  provider: string;
  merchant: string;
  [key: string]: unknown;
}

const providerColors: Record<string, string> = {
  ALL:  'bg-text-primary/10 text-text-primary',
  PP:   'bg-provider-pp/20 text-provider-pp hover:bg-provider-pp/30',
  JILI: 'bg-provider-jili/20 text-provider-jili hover:bg-provider-jili/30',
  PG:   'bg-provider-pg/20 text-provider-pg hover:bg-provider-pg/30',
  JDB:  'bg-provider-jdb/20 text-provider-jdb hover:bg-provider-jdb/30',
  EVO:  'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
  SP:   'bg-green-500/20 text-green-400 hover:bg-green-500/30',
};

export default function HomePage() {
  const [games, setGames] = useState<ProviderGame[]>([]);
  const [activeProvider, setActiveProvider] = useState('ALL');
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState('');
  const [launchGameName, setLaunchGameName] = useState('Buffalo Win');
  const [launchHtml, setLaunchHtml] = useState<string | null>(null);
  const [launchBlobUrl, setLaunchBlobUrl] = useState<string | null>(null);
  const { isAuthenticated, user, providerToken } = useAuth();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/ultraspin/games?page=1&perPage=60')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.ok) throw new Error(data.error || 'Provider catalog unavailable');
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const records = Array.isArray(data.games) ? data.games : [];
        setGames(records.filter((record: ProviderGame) => record.uid && record.game_name && record.provider && record.image));
      })
      .catch((error) => {
        if (!cancelled) setCatalogError(error instanceof Error ? error.message : 'Provider catalog unavailable');
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!launchHtml) {
      setLaunchBlobUrl(null);
      return;
    }
    const blobUrl = URL.createObjectURL(new Blob([launchHtml], { type: 'text/html' }));
    setLaunchBlobUrl(blobUrl);
    return () => URL.revokeObjectURL(blobUrl);
  }, [launchHtml]);

  const launchGame = async (game: ProviderGame) => {
    setLaunchError('');
    if (!isAuthenticated || !providerToken) {
      setLaunchError('Please log in with your UltraSpin account first.');
      return;
    }
    if (launching) return;

    setLaunching(true);
    try {
      const response = await fetch('/api/ultraspin/launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${providerToken}`,
        },
        body: JSON.stringify({ gameRecord: game }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok || typeof data.html !== 'string') {
        throw new Error(data.error || 'Buffalo launch failed');
      }

      setLaunchGameName(game.game_name);
      setLaunchHtml(data.html);
    } catch (error) {
      setLaunchError(error instanceof Error ? error.message : 'Buffalo launch failed');
    } finally {
      setLaunching(false);
    }
  };

  const providers = ['ALL', ...Array.from(new Set(games.map((game) => game.provider)))];
  const filteredGames = activeProvider === 'ALL' ? games : games.filter((game) => game.provider === activeProvider);
  const providerLabel = (provider: string) => {
    if (/pg soft/i.test(provider)) return 'PG';
    if (/pragmatic/i.test(provider)) return 'PP';
    if (/jili/i.test(provider)) return 'JILI';
    if (/jdb/i.test(provider)) return 'JDB';
    return provider.slice(0, 6).toUpperCase();
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Floating Background Text */}
      <motion.div
        className="absolute -top-20 -right-20 text-[12rem] md:text-[16rem] font-bold text-text-primary opacity-[0.02] pointer-events-none select-none"
        animate={{ rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      >
        PLAY
      </motion.div>

      {/* Header */}
      <header className="relative pt-[max(0.75rem,env(safe-area-inset-top))] pb-4 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-text-dark/45 via-text-dark/15 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              iMBET<span className="text-accent-gold">11</span>
            </h1>
            <p className="text-text-secondary text-sm mt-0.5">Premium Gaming</p>
          </div>

          {isAuthenticated ? (
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface"
              animate={{ boxShadow: ['0 0 0px rgba(212,165,52,0)', '0 0 20px rgba(212,165,52,0.3)', '0 0 0px rgba(212,165,52,0)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-text-secondary text-xs">Balance</span>
              <span className="text-accent-gold font-bold">฿{(user?.balance ?? 0).toLocaleString()}</span>
            </motion.div>
          ) : (
            <Link to="/login">
              <motion.div
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent-gold text-text-dark text-sm font-medium"
                whileTap={{ scale: 0.95 }}
              >
                <LogIn size={14} />
                Login
              </motion.div>
            </Link>
          )}
        </motion.div>
      </header>

      {/* Promo Banner */}
      <div className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PromoBanner />
        </motion.div>
      </div>

      {/* Provider Filter */}
      <div className="px-4 pb-4">
        <motion.div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {providers.map((provider) => (
            <motion.button
              key={provider}
              onClick={() => setActiveProvider(provider)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeProvider === provider
                  ? 'bg-accent-gold text-text-dark'
                  : providerColors[provider] || 'bg-surface text-text-secondary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {provider}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {catalogError && (
        <div className="mx-4 mb-4 rounded-lg border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs text-status-error">
          {catalogError}
        </div>
      )}
      {launchError && (
        <div className="mx-4 mb-4 rounded-lg border border-status-error/30 bg-status-error/10 px-3 py-2 text-xs text-status-error">
          {launchError}
        </div>
      )}
      {catalogLoading && (
        <div className="mx-4 mb-4 rounded-lg border border-text-primary/10 bg-surface px-3 py-2 text-xs text-text-secondary">
          Loading real provider game catalog…
        </div>
      )}
      {launching && (
        <div className="mx-4 mb-4 rounded-lg border border-accent-gold/30 bg-accent-gold/10 px-3 py-2 text-xs text-accent-gold">
          Opening Buffalo Win…
        </div>
      )}

      {/* Games Grid */}
      <div className="px-4">
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * index }}
            >
              <GameCard
                title={game.game_name}
                provider={providerLabel(game.provider)}
                image={game.image}
                onClick={game.game_provider === '1007'
                  ? () => launchGame(game)
                  : () => setLaunchError(`${game.provider} launch is not connected yet.`)}
                disabled={launching}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {launchBlobUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex h-full flex-col overflow-hidden rounded-xl bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-sm font-semibold text-white">{launchGameName}</span>
              <button
                type="button"
                onClick={() => setLaunchHtml(null)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white transition-colors hover:bg-white/20"
              >
                Close
              </button>
            </div>
            <iframe
              title="Buffalo Win"
              src={launchBlobUrl}
              className="min-h-0 flex-1 border-0 bg-black"
              allow="autoplay; fullscreen; gamepad"
            />
          </div>
        </div>
      )}

      {/* Floating bottom shadow for nav */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
    </div>
  );
}

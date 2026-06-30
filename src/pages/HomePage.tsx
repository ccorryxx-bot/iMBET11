import { useState } from 'react';
import { motion } from 'framer-motion';
import GameCard from '../components/GameCard';
import PromoBanner from '../components/PromoBanner';

const providers = ['ALL', 'PP', 'JILI', 'PG', 'JDB', 'EVO', 'SP'];

const games = [
  { id: 1, title: 'Fortune Tiger', provider: 'PG' },
  { id: 2, title: 'Wild Bonanza', provider: 'PP' },
  { id: 3, title: 'Golden Empire', provider: 'JILI' },
  { id: 4, title: 'Dragon Treasure', provider: 'JDB' },
  { id: 5, title: 'Mega Jackpot', provider: 'PG' },
  { id: 6, title: 'Lucky Neko', provider: 'PP' },
  { id: 7, title: 'Aztec Gems', provider: 'JILI' },
  { id: 8, title: 'Fishing God', provider: 'JDB' },
  { id: 9, title: 'Star Bounty', provider: 'PG' },
  { id: 10, title: 'Caishen Wins', provider: 'PP' },
  { id: 11, title: 'Super Ace', provider: 'JILI' },
  { id: 12, title: 'Fruit Party', provider: 'JDB' },
  { id: 13, title: 'Gates of Olympus', provider: 'PG' },
  { id: 14, title: 'Wolf Gold', provider: 'PP' },
  { id: 15, title: 'Magic Lamp', provider: 'JILI' },
  { id: 16, title: 'Ocean King', provider: 'JDB' },
  { id: 17, title: 'Sweet Bonanza', provider: 'PG' },
  { id: 18, title: 'Great Rhino', provider: 'PP' },
  { id: 19, title: 'Charge Buffalo', provider: 'JILI' },
  { id: 20, title: 'Lucky Goldbricks', provider: 'JDB' },
  { id: 21, title: 'Wild West Gold', provider: 'PG' },
  { id: 22, title: 'The Dog House', provider: 'PP' },
  { id: 23, title: 'Golden Joker', provider: 'JILI' },
  { id: 24, title: 'Dragon Gold', provider: 'JDB' },
  { id: 25, title: 'Book of Tut', provider: 'PG' },
  { id: 26, title: 'Mustang Gold', provider: 'PP' },
  { id: 27, title: 'Boxing King', provider: 'JILI' },
  { id: 28, title: 'Fortune Pig', provider: 'JDB' },
  { id: 29, title: 'Kraken Unleashed', provider: 'PG' },
  { id: 30, title: 'Chilli Heat', provider: 'PP' },
  { id: 31, title: 'Money Coming', provider: 'JILI' },
  { id: 32, title: 'Lucky Ball', provider: 'JDB' },
  { id: 33, title: 'Egyptian Fortunes', provider: 'PG' },
  { id: 34, title: 'John Hunter', provider: 'PP' },
  { id: 35, title: 'Roma X', provider: 'JILI' },
  { id: 36, title: 'Muay Thai', provider: 'JDB' },
  { id: 37, title: 'Vampire Delight', provider: 'PG' },
  { id: 38, title: 'Pyramid King', provider: 'PP' },
  { id: 39, title: 'Fortune Gems', provider: 'JILI' },
  { id: 40, title: 'Bubble Shooter', provider: 'JDB' },
];

const providerColors: Record<string, string> = {
  ALL: 'bg-text-primary/10 text-text-primary',
  PP: 'bg-provider-pp/20 text-provider-pp hover:bg-provider-pp/30',
  JILI: 'bg-provider-jili/20 text-provider-jili hover:bg-provider-jili/30',
  PG: 'bg-provider-pg/20 text-provider-pg hover:bg-provider-pg/30',
  JDB: 'bg-provider-jdb/20 text-provider-jdb hover:bg-provider-jdb/30',
  EVO: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
  SP: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
};

export default function HomePage() {
  const [activeProvider, setActiveProvider] = useState('ALL');

  const filteredGames =
    activeProvider === 'ALL'
      ? games
      : games.filter((g) => g.provider === activeProvider);

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
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface"
            animate={{ boxShadow: ['0 0 0px rgba(212,165,52,0)', '0 0 20px rgba(212,165,52,0.3)', '0 0 0px rgba(212,165,52,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-text-secondary text-xs">Balance</span>
            <span className="text-accent-gold font-bold">฿12,580</span>
          </motion.div>
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
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <GameCard
                title={game.title}
                provider={game.provider}
                imageId={game.id}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating bottom shadow for nav */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />
    </div>
  );
}

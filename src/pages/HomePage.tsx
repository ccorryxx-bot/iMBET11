import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import GameCard from '../components/GameCard';
import PromoBanner from '../components/PromoBanner';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://raw.githubusercontent.com/ccorryxx-bot/game-assets/c3b26f6848ae526babcbe3fbab75e8a5a61b00e8';

const providers = ['ALL', 'PP', 'JILI', 'PG', 'JDB', 'EVO', 'SP'];

const games = [
  { id: 1,  title: 'Fortune Tiger',    provider: 'PG',   image: `${BASE}/pg/028bd89b2120e880bcf1968c37277460.jpg` },
  { id: 2,  title: 'Wild Bonanza',     provider: 'PP',   image: `${BASE}/pp/002ccc80cfff9b1563814f7cd2a6d0fe.jpg` },
  { id: 3,  title: 'Golden Empire',    provider: 'JILI', image: `${BASE}/jili/0074a83d2b9d825f796e9b62a9431a16.jpg` },
  { id: 4,  title: 'Dragon Treasure',  provider: 'JDB',  image: `${BASE}/jdb/00b886803f3d067f7028872468e84745.jpg` },
  { id: 5,  title: 'Mega Jackpot',     provider: 'PG',   image: `${BASE}/pg/08d92dc2ca14f42c681b44297386d600.jpg` },
  { id: 6,  title: 'Lucky Neko',       provider: 'PP',   image: `${BASE}/pp/00ab11e01d9f85c9b74e0e52233e9a85.jpg` },
  { id: 7,  title: 'Aztec Gems',       provider: 'JILI', image: `${BASE}/jili/007f5afeab86a47d96038324438c0c1f.jpg` },
  { id: 8,  title: 'Fishing God',      provider: 'JDB',  image: `${BASE}/jdb/0160b30b64598290365f61211fb84a7b.jpg` },
  { id: 9,  title: 'Star Bounty',      provider: 'PG',   image: `${BASE}/pg/0a8772ad753cfce2c03c0599ad60c74c.jpg` },
  { id: 10, title: 'Caishen Wins',     provider: 'PP',   image: `${BASE}/pp/00c3f19ee51d2c52a20a7b88fe8c6d9c.jpg` },
  { id: 11, title: 'Super Ace',        provider: 'JILI', image: `${BASE}/jili/00aa0630c427f1b2e14152e81e82a446.jpg` },
  { id: 12, title: 'Fruit Party',      provider: 'JDB',  image: `${BASE}/jdb/03c2cd347f0600cc87601e0d0af3b2f4.jpg` },
  { id: 13, title: 'Gates of Olympus', provider: 'PG',   image: `${BASE}/pg/0da0fda6981138234f03cb665984c07e.jpg` },
  { id: 14, title: 'Wolf Gold',        provider: 'PP',   image: `${BASE}/pp/00d1836f3a1200cb6754a61be4c39160.jpg` },
  { id: 15, title: 'Magic Lamp',       provider: 'JILI', image: `${BASE}/jili/00d92d5cec10cf85623938222a6c2bb6.jpg` },
  { id: 16, title: 'Ocean King',       provider: 'JDB',  image: `${BASE}/jdb/046f8dce34ee2a53c86d0a54e0bb89d2.jpg` },
  { id: 17, title: 'Sweet Bonanza',    provider: 'PG',   image: `${BASE}/pg/0f5374a4766f204a6420120dcfecd9e2.jpg` },
  { id: 18, title: 'Great Rhino',      provider: 'PP',   image: `${BASE}/pp/018cd71c3da7eaecf4c707fe93df0983.jpg` },
  { id: 19, title: 'Charge Buffalo',   provider: 'JILI', image: `${BASE}/jili/014c49675e1c22c76352b8047ae6d8eb.jpg` },
  { id: 20, title: 'Lucky Goldbricks', provider: 'JDB',  image: `${BASE}/jdb/04a3be36bbf1110345d53e07df9c9cc3.jpg` },
  { id: 21, title: 'Wild West Gold',   provider: 'PG',   image: `${BASE}/pg/101ca3ff83b149dcf3439309e9b32142.jpg` },
  { id: 22, title: 'The Dog House',    provider: 'PP',   image: `${BASE}/pp/01e4cb8a338a238c044d7cc69d26000f.jpg` },
  { id: 23, title: 'Golden Joker',     provider: 'JILI', image: `${BASE}/jili/0426ba674c9dd29de6fa023afcf0640d.jpg` },
  { id: 24, title: 'Dragon Gold',      provider: 'JDB',  image: `${BASE}/jdb/05dc8c7a43305c3fcb43574c570d6378.jpg` },
  { id: 25, title: 'Book of Tut',      provider: 'PG',   image: `${BASE}/pg/116989bb267a72035bd01818c5496126.jpg` },
  { id: 26, title: 'Mustang Gold',     provider: 'PP',   image: `${BASE}/pp/031f433c91b6b997d406773a7385df0f.jpg` },
  { id: 27, title: 'Boxing King',      provider: 'JILI', image: `${BASE}/jili/04c9784b0b1b162b2c86f9ce353da8b7.jpg` },
  { id: 28, title: 'Fortune Pig',      provider: 'JDB',  image: `${BASE}/jdb/0651af3e73c7600633522ffe15cc175b.jpg` },
  { id: 29, title: 'Kraken Unleashed', provider: 'PG',   image: `${BASE}/pg/13109a0d9c012f7f92f192c34a8926bf.jpg` },
  { id: 30, title: 'Chilli Heat',      provider: 'PP',   image: `${BASE}/pp/03ca2d1bef1ca213826750ee1e38b6fd.jpg` },
  { id: 31, title: 'Money Coming',     provider: 'JILI', image: `${BASE}/jili/05b10f6b1b5055e4f86c97c717304602.jpg` },
  { id: 32, title: 'Lucky Ball',       provider: 'JDB',  image: `${BASE}/jdb/067d540d7ece7e7dfcfcadf11f25a71d.jpg` },
  { id: 33, title: 'Egyptian Fortunes',provider: 'PG',   image: `${BASE}/pg/22b189b05dd3095a12f862d64fe88847.jpg` },
  { id: 34, title: 'John Hunter',      provider: 'PP',   image: `${BASE}/pp/03e022cf43928af26cfb8bfce18fd8e8.jpg` },
  { id: 35, title: 'Roma X',           provider: 'JILI', image: `${BASE}/jili/05fc951a633d4c6b4bbe8c429cd63658.jpg` },
  { id: 36, title: 'Muay Thai',        provider: 'JDB',  image: `${BASE}/jdb/07df172c089e29e576aa41eeb0cbeb2b.jpg` },
  { id: 37, title: 'Vampire Delight',  provider: 'PG',   image: `${BASE}/pg/24d8e1dbc5cface0907f5a21ecd56753.jpg` },
  { id: 38, title: 'Pyramid King',     provider: 'PP',   image: `${BASE}/pp/045f290df6c578256adb632ea1da485f.jpg` },
  { id: 39, title: 'Fortune Gems',     provider: 'JILI', image: `${BASE}/jili/06ad05bdbfafec916c5eb313c50a949c.jpg` },
  { id: 40, title: 'Bubble Shooter',   provider: 'JDB',  image: `${BASE}/jdb/0e8432be6bc0cab304b41bc964aaf154.jpg` },
];

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
  const [activeProvider, setActiveProvider] = useState('ALL');
  const { isAuthenticated, user } = useAuth();

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
              transition={{ delay: 0.03 * index }}
            >
              <GameCard
                title={game.title}
                provider={game.provider}
                image={game.image}
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
